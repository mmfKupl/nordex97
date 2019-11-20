use a0350381_nordex97;

create table Admin (
	IDAdmin int not null auto_increment,
    Password varchar(600),
    Login varchar(100),
    constraint CS_PK_AdminID primary key(IDAdmin)
);

create table Category (
	IDCategory int not null AUTO_INCREMENT,
	Title varchar(30) not null,
	Sub int not null,
	ExpandId int,
	Expand int,
	constraint CS_PK_CategoryID primary key(IDCategory)
);

create table Item (
	IDItem int not null AUTO_INCREMENT,
	IDCategory int not null,
	Title varchar(255) not null,
	Description varchar(1200),
	VendorCode varchar(20) not null unique,
	Property varchar(2000),
    Keywords varchar(300) default '',
	Available bit not null default 0,
	constraint CS_PK_ItemID primary key(IDItem),
	constraint CS_FK_ItemIDCategory foreign key(IDCategory) references Category(IDCategory) on delete no action on update cascade
);

create procedure GetAdmin(pass varchar(600), login varchar(100))
select IDAdmin, Login from Admin where login = Login and Password = pass;



create procedure GetItemByCategoryId(IDCategory int)
select * from Item where IDCategory = IDCategory;

create procedure GetSearchData(SearchStr varchar(40))
select * from Item where Title like SearchStr or VendorCode like SearchStr;

create procedure GetItemTable()
select * from Item;

create procedure GetCategoryTable()
select * from Category;

create procedure AddCategory(Title varchar(30), Sub bit, ExpandId int, Expand int)
insert into Category(Title, Sub, ExpandId, Expand) values(Title, Sub, ExpandId, Expand);

create procedure AddItem(
IDCategory int,
Title varchar(255),
Description varchar(1200),
VendorCode varchar(20),
Property varchar(2000),
Keywords varchar(300),
Available bit)
insert into Item(IDCategory, Title, Description, VendorCode, Property, Keywords, Available)
values(IDCategory, Title, Description, VendorCode, Property, Keywords, Available);






