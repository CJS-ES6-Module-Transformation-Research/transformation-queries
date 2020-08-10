import {FILE_TYPE} from "../index";
import {Visitor, VisitorOption} from 'estraverse'
import * as estree from "ESTree"
import {CallExpression, Identifier, Literal, Node, SimpleLiteral} from "estree";

//
// export let
//     isCallExpr = ((e: Node): e is CallExpression => true),
//     isIdentifier = ((e: Node): e is Identifier => true),
//     isLiteral = ((e: Node): e is Literal => true),
//     isSimpleLiteral = ((e: Node): e is SimpleLiteral => true);

// export type visitor = (node: Node, parent: Node | null) => (VisitorOption | Node | void)

// export


//
// test_resources.export interface AstFile {
//     dir: string
//     filePath: string
//     shebang:string
//     ast: estree.Program
// }
//
//
// test_resources.export interface ProjectFS {
//     project: string,
//     files: Array<FileDescript>,
//     dirs: Array<DirDescript>
// }
//
// test_resources.export interface DirDescript {
//     dir: string,
//     relative: string
// }
//
// test_resources.export interface FileDescript {
//     dir: string,
//     file: string,
//     full: string,
//     ftype: FILE_TYPE,
//     relative: string
// }

//
// test_resources.export interface ProjectData {
//     project: ProjectFS
//     asts: AstFile[]
// }
//
//
// test_resources.export type WrappedVisitor = (astFile: AstFile) => Visitor
