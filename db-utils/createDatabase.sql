create database proraw

use proraw

create table Category (
	IDCategory int not null identity(1,1),
	Title varchar(30) not null,
	Sub bit not null,
	ExpandId int,
	Expand int,
	constraint CS_PK_CategoryID primary key(IDCategory)
)

create table Item (
	IDItem int not null identity(1,1),
	IDCategory int not null,
	Title varchar(255) not null,
	Description varchar(600),
	VendorCode varchar(20) not null,
	Property varchar(600),
	Available bit not null default 0,
	constraint CS_PK_ItemID primary key(IDItem),
	constraint CS_FK_ItemIDCategory foreign key(IDCategory) references Category(IDCategory) on delete no action on update cascade
)

select * from Item
select * from Category

go
create proc GetItemByCategoryId
@IDCategory int
as
select * from Item where IDCategory = @IDCategory

go
create proc GetSearchData
@SearchStr varchar(40)
as
set @SearchStr = '%' + @SearchStr + '%'
select * from Item where Title like @SearchStr or VendorCode like @SearchStr

go
create proc GetItemTable
as
select * from Item

go 
create proc GetCategoryTable
as
select * from Category

go 
create proc AddCategory
@Title varchar(30),
@Sub bit,
@ExpandId int,
@Expand int
as
insert into Category(Title, Sub, ExpandId, Expand) values(@Title, @Sub, @ExpandId, @Expand)

go 
create proc AddItem
@IDCategory int,
@Title varchar(255),
@Description varchar(600),
@VendorCode varchar(20),
@Property varchar(600),
@Available bit
as
insert into Item(IDCategory, Title, Description, VendorCode, Property, Available)
values(@IDCategory, @Title, @Description, @VendorCode, @Property, @Available)