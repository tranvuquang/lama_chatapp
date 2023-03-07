import { Request, Response, NextFunction } from "express";

export interface RequestExtended extends Request {
  
}

export interface ResponseExtended extends Response {}

export interface NextFunctionExtended extends NextFunction {}
