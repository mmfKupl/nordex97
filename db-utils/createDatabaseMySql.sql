use a0350381_nordex97;

create table Admin (
	IDAdmin int not null auto_increment,
    Password varchar(600) not null,
    Login varchar(100) not null,
    SessionKey varchar(100) null,
    KeyBindingDate date null,
    constraint CS_PK_AdminID primary key(IDAdmin)
);

create procedure CreateCategoryTable()
create table Category (
	IDCategory int not null AUTO_INCREMENT,
	Title varchar(30) not null,
	Sub int not null,
	ExpandId int,
	Expand int,
	constraint CS_PK_CategoryID primary key(IDCategory)
);

create table Category (
	IDCategory int not null AUTO_INCREMENT,
	Title varchar(30) not null,
	Sub int not null,
	ExpandId int,
	Expand int,
	constraint CS_PK_CategoryID primary key(IDCategory)
);


create procedure CreateItemTable()
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
	constraint CS_FK_ItemIDCategory foreign key(IDCategory) references Category(IDCategory) on delete no action on update no action
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
	constraint CS_FK_ItemIDCategory foreign key(IDCategory) references Category(IDCategory) on delete no action on update no action
);
delimiter //
create procedure AdminLogIn(_Login varchar(100), _Password varchar(600))
begin
declare adminId int;
set adminId = (select IDAdmin from Admin where Login = _Login and Password = _Password);
if adminId is not null then
	call SetSessionKey(adminId, _Password, md5(now() + _Password), now());
    select IDAdmin, SessionKey from Admin where IDAdmin = adminId and Password = _Password;
else
	select -1 as 'IDAdmin';
end if;
end //
delimiter ;

delimiter //
create procedure AdminLogOut(_IDAdmin int)
begin
update Admin set SessionKey = null, KeyBindingDate = null where IDAdmin = _IDAdmin;
end //
delimiter ;

delimiter //
create procedure ValidateAdminAction(_IDAdmin int, _SessionKey varchar(100))
begin
	if _IDAdmin is not null and _SessionKey is not null then
    begin
		declare nowDate date;
		declare bindingDate date;
		set nowDate = now();
		set bindingDate = (select KeyBindingDate from Admin where IDAdmin = _IDAdmin and SessionKey = _SessionKey);
		if bindingDate is null or nowDate > bindingDate + interval 1 hour then
			update Admin set SessionKey = null, KeyBindingDate = null where IDAdmin = _IDAdmin;
			select false as 'Valid';
		else
			select true as 'Valid';
		end if;
	end;
    else
		select false as 'Valid';
	end if;    
end //
delimiter ;
    
delimiter //
create procedure SetSessionKey(_IDAdmin int, _Password varchar(600), _SessionKey varchar(100), _KeyBindingDate date)
begin
	update Admin set SessionKey = _SessionKey, KeyBindingDate = _KeyBindingDate where IDAdmin = _IDAdmin and Password = _Password;
end //
delimiter ;

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

select * from Category;




