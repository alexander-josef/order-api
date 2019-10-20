import { NextFunction, Request, Response } from 'express';
export declare let getUser: (req: Request, res: Response, next: NextFunction) => void;
export declare let addUser: (req: Request, res: Response, next: NextFunction) => void;
export declare let updateUser: (req: Request, res: Response, next: NextFunction) => void;
export declare let removeUser: (req: Request, res: Response, next: NextFunction) => void;
export declare let login: (req: Request, res: Response, next: NextFunction) => void;
