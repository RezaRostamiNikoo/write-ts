import * as ts from "typescript";
import { ModifierLikeHandler } from "./modifiers";

export class ParameterGenerator {
    private _name: string;
    private _type: ts.TypeNode;

    private _modifiers: ModifierLikeHandler = new ModifierLikeHandler();

    private _isSpread: boolean = false;
    private _isOptional: boolean = false;
    private _identifier: ts.Identifier;

    private _initial: ts.Expression;
    get Identifier(): ts.Identifier { return this._identifier }

    constructor(name: string | ts.Identifier) {
        if (typeof name === "string") {
            this._name = name;
            this._identifier = ts.factory.createIdentifier(name);
        } else {
            this._name = name.text;
            this._identifier = name;
        }
    }

    spread(): this { this._isSpread = true; return this; }
    notSpread(): this { this._isSpread = false; return this; }

    optional(): this { this._isOptional = true; return this; }
    required(): this { this._isOptional = false; return this; }

    setType(typeNode: ts.TypeNode): this { this._type = typeNode; return this; }
    init(expression: ts.Expression): this { this._initial = expression; return this; }

    generate(): ts.ParameterDeclaration {
        return ts.factory.createParameterDeclaration(
            this._modifiers.toArray(),
            this._isSpread ? ts.factory.createToken(ts.SyntaxKind.DotDotDotToken) : undefined,
            this._name,
            this._isOptional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
            this._type ?? undefined,
            this._initial ?? undefined

        )
    }



}