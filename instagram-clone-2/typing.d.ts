export type appFetch = {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  body?: any;
  headers?: object;
};

type mongooseObject = {
  _id: string;
  createdAt: Date;
};

export type user = mongooseObject & {
  name: string;
  email: string;
  token: string;
  isEmailVerified: boolean;
};

export type post = mongooseObject & {
  image: {
    width: number;
    height: number;
    url: string;
  };
  caption: string;
  user: {
    _id: string;
    name: string;
  };
  comments: comment[];
  likes: like[];
};

export type comment = {
  _id: string;
  commentedAt: Date;
  caption: string;
  user: {
    _id: string;
    name: string;
  };
};

export type comment = {
  _id: string;
  commentedAt: Date;
  caption: string;
  user: {
    _id: string;
    name: string;
  };
};

export type like = {
  _id: string;
  likedAt: Date;
  user: {
    _id: string;
    name: string;
  };
};
