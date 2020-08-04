Drop Database if Exists GenSim;

Create Database GenSim;

Use GenSim;

Create Table dynasty (
	name VarChar(30) primary key,
    crestType int Not Null,
    crestDesign int Not Null,
    primaryColorRed int Not Null,
	primaryColorGreen int Not Null,
	primaryColorBlue int Not Null,
    secondaryColorRed int,
    secondaryColorGreen int,
    secondaryColorBlue int
);

Create Table trait (
	name VarChar(50) primary key
);

Create Table traitValues (
	name VarChar(50),
    value VarChar(50),
    primary key (name, value),
    place int Not Null,
	constraint fk_traitValues_trait
		foreign key (name)
        references trait(name)
);

Create Table `member` (
	memberId int primary key auto_increment,
	name VarChar(30) Not Null,
    primaryDynasty VarChar(30) Not Null,
    spouseId int,
    matrilineal boolean,
    fatherId int,
    motherId int,
    living boolean Not Null,
    founder boolean Not Null,
    constraint fk_memberDynasty_dynasty
		foreign key (primaryDynasty)
        references dynasty(name),
    constraint fk_memberMember_spouse
		foreign key (spouseId)
        references `member`(memberId),
	constraint fk_memberMember_father
		foreign key (fatherId)
        references `member`(memberId),
	constraint fk_memberMember_mother
		foreign key (motherId)
        references `member`(memberId)
);

Create Table traitpackage (
	name VarChar(50),
    memberId int,
    primary key(name, memberId),
    value VarChar(50) Not Null,
    vpA VarChar(50) Not Null,
    vpB VarChar(50) Not Null,
    vpC VarChar(50) Not Null,
    vpD VarChar(50) Not Null,
    constraint fk_traitTraitpackage_trait
		foreign key (name)
        references trait(name),
	constraint fk_traitpackageMember_member
		foreign key (memberId)
        references `member`(memberId)
);

Create Table memberSecondarydynasties (
	memberId int,
    name VarChar(30),
    indexOrder int,
    primary key(memberId, name),
    constraint fk_memberSecondaryDynasty_member
		foreign key (memberId)
        references `member`(memberId),
	constraint fk_memberSecondaryDynasty_dynasty
		foreign key (name)
        references dynasty(name)
);

Create Table memberPastSpouses (
	memberIdA int,
    memberIdB int,
    primary key (memberIdA, memberIdB),
    constraint fk_memberSpouse_memberA
		foreign key (memberIdA)
        references `member`(memberId),
	constraint fk_memberSpouse_memberB
		foreign key (memberIdB)
        references `member`(memberId)
);

Insert Into trait values
("Sex"),
("Eye Color"),
("Hair Color Red Scale"),
("Hair Color Dark Scale"),
("Skin Color"),
("Height"),
("Dominant Hand"),
("Freckles"),
("Hair Straightness"),
("Earlobe Connectivity"),
("Hairline"),
("Dimples"),
("Cleft Chin"),
("Nose Bridge"),
("Nose Width"),
("Bald"),
("Lip Size"),
("Eye Size"),
("Forlock Color");

Insert Into traitValues values
("Sex", "Male", 0),
("Sex", "Female", 1),

("Eye Color", "Brown", 0),
("Eye Color", "Amber", 1),
("Eye Color", "Hazel", 2),
("Eye Color", "Green", 3),
("Eye Color", "Blue", 4),
("Eye Color", "Grey", 5),
("Eye Color", "Light Blue", 6),

("Hair Color Red Scale", "Some", 0),
("Hair Color Red Scale", "None", 1),
("Hair Color Red Scale", "Total", 2),

("Hair Color Dark Scale", "Dark", 0),
("Hair Color Dark Scale", "Medium", 1),
("Hair Color Dark Scale", "Light", 2),
("Hair Color Dark Scale", "Black", 3),
("Hair Color Dark Scale", "White", 4),

("Skin Color", "Dark", 0),
("Skin Color", "Brown", 1),
("Skin Color", "Olive", 2),
("Skin Color", "Medium", 3),
("Skin Color", "Fair", 4),
("Skin Color", "Light", 5),

("Height", "Tall", 0),
("Height", "Medium", 1),
("Height", "Short", 2),

("Dominant Hand", "Right", 0),
("Dominant Hand", "Left", 1),

("Freckles", "Freckles", 0),
("Freckles", "No Freckles", 1),

("Hair Straightness", "Curly", 0),
("Hair Straightness", "Wavy", 1),
("Hair Straightness", "Straight", 2),

("Earlobe Connectivity", "Free", 0),
("Earlobe Connectivity", "Attached", 1),

("Hairline", "Peaked", 0),
("Hairline", "Flat", 1),

("Dimples", "Dimples", 0),
("Dimples", "No Dimples", 1),

("Cleft Chin", "Cleft", 0),
("Cleft Chin", "No Cleft", 1),

("Nose Bridge", "Roman", 0),
("Nose Bridge", "Flat", 1),

("Nose Width", "Broad", 0),
("Nose Width", "Narrow", 1),

("Bald", "Bald", 0),
("Bald", "Not Bald", 1),

("Lip Size", "Full", 0),
("Lip Size", "Thin", 1),

("Eye Size", "Large", 0),
("Eye Size", "Small", 1),

("Forlock Color", "White", 0),
("Forlock Color", "Uniform", 1);

Select * From `member`;
Select * From traitpackage Where memberId = 4;
Select * From memberSecondarydynasties Where memberId = 4;