CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY, 
    password VARCHAR(25) NOT NULL,
    fname VARCHAR(50) NOT NULL, 
    lname VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    UNIQUE (email)
);

CREATE TABLE admin (
    sellerId INT AUTO_INCREMENT PRIMARY KEY, 
    password VARCHAR(25) NOT NULL,
    shelterName VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL (11, 8) NOT NULL,
    aboutMe TEXT,
    fname VARCHAR(50) NOT NULL, 
    lname VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    website VARCHAR(255), 
    phone VARCHAR(12),
    UNIQUE (email)
);

CREATE TABLE pets (
    petId INT AUTO_INCREMENT PRIMARY KEY, 
    sellerId INT NOT NULL,
    status VARCHAR(15) DEFAULT 'Available',
    animal VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL, 
    breed VARCHAR(100),
    sex VARCHAR(8) NOT NULL,
    age INT NOT NULL,
    ageGroup VARCHAR(10) NOT NULL,
    weight INT NOT NULL,
    size VARCHAR(11) NOT NULL,
    adoptionFee INT NOT NULL,
    aboutMe TEXT,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL (11, 8) NOT NULL,
    photo1 VARCHAR(255),
    photo2 VARCHAR(255),
    photo3 VARCHAR(255),
    photo4 VARCHAR(255),
    photo5 VARCHAR(255),
    photo6 VARCHAR(255),
    goodWithKids VARCHAR(7) DEFAULT 'UNKNOWN',
    goodWithDogs VARCHAR(7) DEFAULT 'UNKNOWN',
    goodWithCats VARCHAR(7) DEFAULT 'UNKNOWN',
    requiresFence VARCHAR(7) DEFAULT 'UNKNOWN',
    houseTrained VARCHAR(7) DEFAULT 'UNKNOWN',
    neuteredSpayed VARCHAR(7) DEFAULT 'UNKNOWN',
    shotsUpToDate VARCHAR(7) DEFAULT 'UNKNOWN',
    FOREIGN KEY (sellerId) REFERENCES admin(sellerId)
        ON DELETE CASCADE
);

CREATE TABLE favorites (
    userId INT NOT NULL,
    petId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
        ON DELETE CASCADE,
    FOREIGN KEY (petId) REFERENCES pets(petId)
        ON DELETE CASCADE,
    CONSTRAINT 'favoritePet' UNIQUE (userId, petId)
);
