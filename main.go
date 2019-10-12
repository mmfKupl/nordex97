package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/tealeg/xlsx"
)

const (
	sitePath = "https://proraw.ru"
	waitTime = 700 * time.Millisecond
)

// Section ...
type Section struct {
	Title, link string
}

// Item ...
type Item struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Article     string `json:"article"`
	Property    string `json:"property"`
	Available   string `json:"available"`
}

var sectionsList []Section

var itemsChan = make(chan Item, 10)
var waitChan = make(chan struct{}, 10)

var totalItemAmount = 0
var currentItemAmount = 0

func init() {
	const sectionsQuery = ".v-catalog__list > li > a.v-catalog__link"
	// download all sections and group they
	page, err := downloadPage(sitePath)
	if err != nil {
		panic(err)
	}

	secs := page.Find(sectionsQuery)
	sectionsList = make([]Section, secs.Length())
	secs.Each(func(i int, s *goquery.Selection) {
		href, ok := s.Attr("href")
		if !ok {
			return
		}
		re := regexp.MustCompile(`/filter|/apply/w*`)
		re1 := regexp.MustCompile(`-is-`)
		href = re.ReplaceAllString(href, "")
		href = sitePath + re1.ReplaceAllString(href, "_")
		text := s.Text()
		sectionsList[i] = Section{text, href}
	})
}

func main() {
	defer waitInput()
	st := time.Now()
	defer fmt.Println("Выход!")
	defer func() { fmt.Println("Вермя выполнения программы - ", time.Since(st)) }()
	selected := selectSections()
	if len(selected) == 0 {
		return
	}
	fmt.Println("Выбранные элементы:")
	printSections(selected)

	fmt.Print("Начать скачивание? (y/n) ")
	start := ""
	fmt.Fscan(os.Stdin, &start)
	if start != "y" {
		return
	}

	fmt.Println("Начало скачивания...")

	wg := new(sync.WaitGroup)
	// go saveItem(wg)
	go saveItemToJSON(wg)
	wg.Add(1)
	go startDownload(selected, wg)
	wg.Wait()
	close(itemsChan)
}

func startDownload(sections []Section, wg *sync.WaitGroup) {
	defer wg.Done()
	for _, val := range sections {
		wg.Add(1)
		go parseSection(val, wg)
	}
}

func parseSection(section Section, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("%+s\n", section.link)
	page, err := downloadPage(section.link)
	if err != nil {
		fmt.Println(err)
		return
	}

	pagesAmount := 0

	if pagesAmount == 0 {
		wg.Add(1)
		go parsePageSection(page, wg)
	}

}

func parsePageSection(page *goquery.Document, wg *sync.WaitGroup) {
	defer wg.Done()
	itemsLinks := page.Find(".v-products-tbl__title > .v-products-tbl__name").Map(func(i int, s *goquery.Selection) string {
		href, _ := s.Attr("href")
		return sitePath + href
	})

	totalItemAmount += len(itemsLinks)
	for _, val := range itemsLinks {
		wg.Add(1)
		waitChan <- struct{}{}
		go parseItemPage(val, wg)
	}
}

func parseItemPage(url string, wg *sync.WaitGroup) {
	page, err := downloadPage(url)
	if err != nil {
		fmt.Println()
		<-waitChan
		return
	}

	// re := regexp.MustCompile(`\s+`)

	title := page.Find(".v-product-info__title").Text()
	description := page.Find(".v-product-description__header__content").Text()
	article := strings.Replace(page.Find(".v-product-selections__sku .hint").First().Text(), "Артикул: ", "", -1)
	property := strings.Join(page.Find(".v-product-features__zag + .v-product-features__table .v-product-features__tr").Map(func(i int, s *goquery.Selection) string {
		text := ""
		text += s.Find(".v-product-features__left").Text() + "|" + s.Find(".v-product-features__right").Text()
		return text
		// return re.ReplaceAllString(text, "")
	}), "\n")

	available := page.Find(".stock-high.v-product-stock._height").First().Text()

	article = strings.Trim(article, " \n\t")

	item := Item{title, description, article, property, available}
	itemsChan <- item

}

func saveItemToJSON(wg *sync.WaitGroup) {
	jsonFileName := "proraw.json"
	file, err := os.Create(jsonFileName)
	if err != nil {
		fmt.Println("невозможно открыть и создать файл json")
		fmt.Println(err)
		os.Exit(1)
	}
	file.WriteString("[")
	first := true
	for it := range itemsChan {
		if !first {
			file.WriteString(", ")
		}
		jsonString, err := json.Marshal(it)
		if err != nil {
			fmt.Printf("Неудалось преобразовать в json %s: %s", it.Article, err)
		}
		_, err = file.Write(jsonString)
		if err != nil {
			fmt.Printf("Неудалось записать в json %s: %s", it.Article, err)
		}

		currentItemAmount++
		time.Sleep(waitTime)
		<-waitChan
		fmt.Printf("\r%d/%d\t-\t%s\t\t", currentItemAmount, totalItemAmount, it.Article)
		wg.Done()
		first = false
	}
	file.WriteString("]")
	file.Close()

}

func saveItem(wg *sync.WaitGroup) {
	excelFileName := "./proraw.xlsx"
	var file *xlsx.File
	var sheet *xlsx.Sheet
	file, err := xlsx.OpenFile(excelFileName)
	if err != nil {
		file = xlsx.NewFile()
	}

	if len(file.Sheets) == 0 {
		sheet, err = file.AddSheet("Sheet1")
		if err != nil {
			fmt.Printf(err.Error())
		}
	} else {
		sheet = file.Sheets[0]
	}
	_ = sheet.SetColWidth(0, 0, 20)
	_ = sheet.SetColWidth(1, 1, 20)
	_ = sheet.SetColWidth(2, 2, 40)
	_ = sheet.SetColWidth(3, 3, 20)
	_ = sheet.SetColWidth(4, 4, 50)
	_ = sheet.SetColWidth(4, 4, 50)
	_ = sheet.SetColWidth(4, 4, 10)

	fmt.Println("")
	for it := range itemsChan {
		addRow(it, sheet)
		currentItemAmount++
		time.Sleep(waitTime)
		<-waitChan
		fmt.Printf("\r%d/%d\t-\t%s\t\t", currentItemAmount, totalItemAmount, it.Article)
		if err = file.Save(excelFileName); err != nil {
			fmt.Printf("Неудалось записать %s в документ: %s", it.Article, err)
		}
		wg.Done()
	}
	fmt.Println()
}

func addRow(it Item, sheet *xlsx.Sheet) {
	r := sheet.AddRow()
	c := r.AddCell()
	c.SetString(it.Article)
	c = r.AddCell()
	c.SetString(it.Title)
	c = r.AddCell()
	c.SetString(it.Description)
	c = r.AddCell()
	c.SetString(it.Property)
	c = r.AddCell()
	c.SetString(it.Available)
	c = r.AddCell()
}

func downloadPageToFile(link string) error {
	res, err := http.Get(link)
	if err != nil {
		return fmt.Errorf("ошибка при загрузке данных сайта!: %s", err.Error())
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return fmt.Errorf("ошибка при загрузке данных сайта!: %d %s", res.StatusCode, res.Status)
	}

	file, err := os.Create("html.html")
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer file.Close()
	_, err = io.Copy(file, res.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Printf("Неудалось сохранить картинку для %s: %s", "asd", err.Error())
		return err
	}
	return nil
}

func downloadImg(url, artikul, folder string) {
	if url == "no photo" {
		return
	}
	res, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		fmt.Printf("status code error: %d %s\n", res.StatusCode, res.Status)
		return
	}
	contentType := strings.Split(res.Header.Get("Content-Type"), "/")[1]
	artikul = strings.ReplaceAll(artikul, "/", "_")
	artikul = strings.ReplaceAll(artikul, " ", "")
	imgPath := fmt.Sprintf("%s/%s.%s", folder, artikul, contentType)
	fmt.Println(imgPath)

	file, err := os.Create(imgPath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	_, err = io.Copy(file, res.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Printf("Неудалось сохранить картинку для %s: %s", artikul, err.Error())
		return
	}
}

func downloadPage(url string) (*goquery.Document, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("ошибка при загрузке данных сайта!: %s", err.Error())
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return nil, fmt.Errorf("ошибка при загрузке данных сайта!: %d %s", res.StatusCode, res.Status)
	}

	page, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, fmt.Errorf("ошибка при загрузке данных сайта!: %s", err.Error())
	}

	return page, nil
}

func selectSections() []Section {
	fmt.Println("Выберите разделы, которые нужно скачать (написать цифру):")
	fmt.Println("0\t-\tВыбрать все")
	for key, val := range sectionsList {
		fmt.Printf("%v\t-\t%s\n", key+1, val.Title)
	}
	fmt.Printf("%v\t-\tНачать\n", len(sectionsList)+1)
	fmt.Println("-1\t-\tВыход")

	selected := make([]Section, 0)

loop:
	for {
		cur := ""
		fmt.Print("-> ")
		fmt.Fscan(os.Stdin, &cur)
		switch cur {
		case fmt.Sprintf("%v", len(sectionsList)+1):
			break loop
		case "0":
			fmt.Println("Выбраны все разделы!")
			selected = append(make([]Section, 0), sectionsList[:]...)
			break loop
		case "-1":
			return nil
		default:
			if len(cur) > 2 {
				break
			}
			curInt, err := strconv.Atoi(cur)
			if err != nil {
				fmt.Println(err)
				break
			}
			if curInt > len(sectionsList) || includes(selected, sectionsList[curInt-1].Title) {
				break
			}
			selected = append(selected, sectionsList[curInt-1])
			printSections(selected)

		}
	}
	return selected
}

func includes(slice []Section, str string) bool {
	for _, val := range slice {
		if strings.Contains(val.Title, str) {
			return true
		}
	}
	return false
}

func printSections(arr []Section) {
	for _, val := range arr {
		fmt.Printf("\t%s\n", val.Title)
	}
}

func waitInput() {
	end := ""
	fmt.Print("Для завершения введите любой символ и нажмите enter ")
	fmt.Fscan(os.Stdin, &end)
}
