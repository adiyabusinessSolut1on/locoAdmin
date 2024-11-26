export interface subcategory {
  _id: string;
  name: string;
  subSubCategories: [subSubCategories];
}
export interface subSubCategories {
  _id: string;
  name: string;
  innerCategories: [innerCategories];
}
export interface innerCategories {
  _id: string;
  name: string;
}
export interface BlogCategory {
  _id: string;
  name: string;
  subCategories: [subcategory];
}

interface blogsubcat {
  _id: string;
  name: string;
  blogs: BlogSTyepes[];
  subSubCategories: [blogssubsub];
}
interface blogssubsub {
  _id: string;
  name: string;
  blogs: BlogSTyepes[];
  innerCategories: [bloginner];
}
interface bloginner {
  _id: string;
  name: string;
  blogs: BlogSTyepes[];
}
export interface BlogSTyepes {
  _id: string;
  title: string;
  slug: string;
  thumnail: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}
export interface BlogWithCategory {
  _id: string;
  name: string;
  subCategories: [blogsubcat];
  blogs: BlogSTyepes[];
}

export interface VideoCategorys {
  _id: string;
  category: string;
}

export interface videosTypes {
  _id: string;
  title: string;
  slug: string;
  thumnail: string;

  category: string;
  url: string;
  tags: string[];
  dectription: string;
  updatedAt: string;
  createdAt: string;
}

export interface UserTypes {
  _id: string;
  image: string;
  name: string;
  mobile: number;
  email: string;
  createdAt: string;
  role: string;
  isVerify: boolean;
}

export interface AwarenessType {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  image: string;
}

export interface ImpLinkDocs {
  _id: string;
  title: string;
  donwloadable: string;
  createdAt: string;
}

export interface DailyTask {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}
export interface AwarenessTypes {
  _id: string;
  category: string;
  createdAt: string;
  description: string;
  image: string;
  title: string;
}

export interface QuestionsType {
  _id: string;
  name: string;
  options: string[];
  predicted_result: string;
  actualresult: string;
  isTrue: boolean;
  answer_description: string;
}
export interface quiztypes {
  _id: string;
  title: string;
  category: string;
  isComplete: boolean;
  instructions: string;
  score: number;
  rightanswers: number;
  wronganswers: number;
  questions: [QuestionsType];
  createdAt: string;
}

export interface QuizAndTestCategoryType {
  // createdAt:string;
  name: string;
  _id: string;
}
export interface sponsorProductsType {
  _id: string;
  name: string;
  image: string;
  description: string;
  active: boolean;
  link: string;
  sponsorname: string;
  createdAt: string;
}
export interface SponsorCompanytypes {
  _id: string;
  name: string;
  type: string;
  image: string;
  link: string;
  video: string;
  description: string;
  active: boolean;
  products: [sponsorProductsType];
  createdAt: string;
}
export interface TestQuestionsType {
  _id: string;
  name: string[];
  options: string[];
  predicted_result: string;
  actualresult: string;
  isTrue: boolean;
  answer_description: string;
}
export interface Testtypes {
  _id: string;
  title: string;
  category: string;
  isComplete: boolean;
  instructions: string;
  score: number;
  rightanswers: number;
  wronganswers: number;
  questions: [TestQuestionsType];
  createdAt: string;
}

export interface awarenessCategoryType {
  createdAt: string;
  name: string;
  _id: string;
}

export type RootState = {
  authToken: {
    userToken: string | null;
  };
};
