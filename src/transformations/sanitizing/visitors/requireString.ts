 import {Identifier, Node, CallExpression} from "estree";
import {RequireStringTransformer} from "../requireStringTransformer";
import {TransformFunction} from '../../Transformer'
import {JSFile} from "../../../abstract_representation/project_representation/javascript/JSFile";
import {Visitor,traverse} from "estraverse";
import {dirname,join} from 'path'


 /**
  * Require string sanitizer visitor. Type of TransformFunction.
  * @param js a JSFile
  */
 export const requireStringSanitizer: TransformFunction = function (js: JSFile) {
    let requireStringTF: RequireStringTransformer = new RequireStringTransformer(dirname(join(js.getDir(),js.getRelative())))
    let visitor: Visitor = {
        enter: function (node: Node): void {


            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {


                let literal = node.arguments[0]
                 let requireString: string = requireStringTF.getTransformed(literal.value.toString())
                 literal.value = requireString
                literal.raw = `'${requireString}'`

            }
        }
    };
    traverse(js.getAST(),visitor)

}




