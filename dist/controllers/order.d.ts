import { NextFunction, Request, Response } from 'express';
export declare let getOrder: (req: Request, res: Response, next: NextFunction) => void;
export declare let getAllOrders: (req: Request, res: Response, next: NextFunction) => void;
export declare let addOrder: (req: Request, res: Response, next: NextFunction) => void;
export declare let removeOrder: (req: Request, res: Response, next: NextFunction) => void;
export declare let getInventory: (req: Request, res: Response, next: NextFunction) => void;
