export class Book {
  book_id: string;
  title: string;
  author: string;
  category: string;
  quantity: number;
  cover: string;
  description: string;
  price: number;
  borrowedBy?: BorrowInfo[];
  createdAt: string;
  updatedAt: string;
}

export class BorrowInfo {
  user_id: string;
  borrow_date: string;
  dueDate: string;
}

export enum BookCategory {
  Fiction = 'Fiction',
  NonFiction = 'Non-Fiction',
  Poetry = 'Poetry',
  Children = "Children's Books",
  GraphicNovelsComics = 'Graphic Novels & Comics',
  Reference = 'Reference Books',
  AcademicTextbooks = 'Academic & Textbooks',
  Sports = 'Sports',
  MusicPerformingArts = 'Music & Performing Arts',
  HobbiesInterests = 'Hobbies & Interests',
  PoliticsCurrentAffairs = 'Politics & Current Affairs',
  LifestyleHome = 'Lifestyle & Home',
  ReligionSpirituality = 'Religion & Spirituality',
  ScienceFictionFantasy = 'Science Fiction & Fantasy',
  DramaPlaywriting = 'Drama & Playwriting',
  DocumentaryTrueStories = 'Documentary & True Stories',
  ComicsGraphicNovels = 'Comics & Graphic Novels',
}
