import {JSFile, TransformableProject} from "../../../abstract_representation/project_representation";
import {traverse, Visitor} from "estraverse";
import {dirname, join} from "path";
import {ProjectTransformFunction} from "../../Transformer";
import {existsSync} from "fs";


/**
 * TransformFunction for creating a JSONFile from a require string of the form '*.json'.
 * @param project the TransformableProject.
 */
export const jsonRequire: ProjectTransformFunction = function (project: TransformableProject) {
    return function (js: JSFile): void {

        let re: RegExp = new RegExp('.+\.json$');

        let visitor: Visitor = {
            enter: (node, parent) => {
                if (node.type === "CallExpression"
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require"
                    && node.arguments[0].type === "Literal"
                    && re.test(node.arguments[0].value.toString())) {
                    const requireString = node.arguments[0].value.toString();



                    const joinedJson = join(dirname(js.getAbsolute()), requireString);
                    const suffix: string = ".export.js";

                    let regex: RegExp
                    regex = new RegExp('.+\.json[0-9]+');
                    let json = joinedJson.replace(js.getDir(), '')
                        .substr(1)//relative(js.getDir(), joinedJson, null)
                   let i = -1;
                    while (existsSync(`${js.getDir()}/${json}${i}${suffix}`)) {
                        i++
                    }

                    let infix = i > -1 ? `${i}`: '';

                    if (project.getJS(json+infix + suffix) === undefined) {
                        const fileData = "module.exports = "
                            + project
                                .getJSON(json)
                                .getText();

                        project.addJS(json +infix+ suffix, fileData)
                    }
                    node.arguments[0].value = requireString+infix + suffix


                }
            }
        }
        traverse(js.getAST(), visitor);
    }
}