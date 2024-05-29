import { Request, Response,NextFunction } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[])  => {
    return async  (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations){
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        res.status(422).json({errors: errors.array()});
    }
}
}

export const loginValidator = [
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password").trim().isLength({min:6}).withMessage("Password must be atleast 6 characters long")
]
export const signupValidator = [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    ...loginValidator,
]
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),
]