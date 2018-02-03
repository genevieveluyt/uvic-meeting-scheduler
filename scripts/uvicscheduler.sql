CREATE TABLE Courses (
    short_name VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(200)
);

CREATE TABLE Sections (
    crn INT PRIMARY KEY,
    course VARCHAR(100) REFERENCES Courses ON DELETE CASCADE,
    section_name CHAR(3),
    weekly BOOLEAN,
    term INT
);

CREATE TABLE TimeBlocks (
	id SMALLSERIAL PRIMARY KEY,
    start_time TIME,
    end_time TIME,
    UNIQUE(start_time, end_time)
);

CREATE TABLE SectionTimes (
    id SERIAL PRIMARY KEY,
    crn INT REFERENCES Sections ON DELETE CASCADE,
    day CHAR(1),
    section_time INT REFERENCES TimeBlocks,
    UNIQUE(crn, day, section_time)
);
