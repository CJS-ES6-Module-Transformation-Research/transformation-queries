import {generate} from "escodegen";
import {replace, traverse, Visitor, VisitorOption} from "estraverse";
import * as ESTree from "estree";
import {
	Identifier,
	ImportDeclaration,
	ImportSpecifier,
	Literal,
	RegExpLiteral,
	SimpleLiteral,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {built_ins, builtins_funcs} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Reporter} from "../../../abstract_fs_v2/Reporter";
import {getListOfVars} from "../../../InfoGatherer";
import {Imports, WithPropNames} from "../../../InfoTracker";
import {API, API_TYPE} from "../../export_transformations/API";

export function cleanMIS(moduleSpecifier: string): string {
	let mos =  moduleSpecifier.replace(/^\.{0,2}\//, '')
	console.log('mos: '+mos )

	return mos
}


export function insertImports(js: JSFile) {
 	js.setAsModule()
	let last: number = 0;
	let info = js.getInfoTracker();
	let listOfVars = getListOfVars(info)
	let infoTracker = js.getInfoTracker();
	let MAM = js.getAPIMap()
	js.getAPIMap()
	let _imports: Imports = new Imports(js.getInfoTracker().getDeMap(), ((mspec: string) => MAM.resolveSpecifier(js, mspec)), MAM, js.getInfoTracker())
	js.setImports(_imports)
	let demap = info.getDeMap()
	let propNameReplaceMap: { [base: string]: { [property: string]: string } } = {}//replaceName
	let mod_map = js.getAPIMap()
	let reporter = js.getReporter()
	let xImportsY = reporter.addMultiLine(Reporter.xImportsY)
	xImportsY.data[js.getRelative()] = []

	function computeType(js: JSFile, init: Identifier, moduleSpecifier: string) {

		try {
			let api = js.getAPIMap().resolveSpecifier(js, moduleSpecifier)

			if (api.getType() !== API_TYPE.named_only) {
				return false;
			}
		} catch (e) {
			console.log('failed on ' + js.getRelative() + "      " + moduleSpecifier)
		}
		return true;
	}

	// if (moduleSpecifier.includes('src/format.js')){}




	//for readability in debugging
	traverse(js.getAST(), {
		enter: (node) => {
			delete node.loc
		}
	})

	let visitor: Visitor = {

		enter: (node, parent): VisitorOption | ESTree.Node | void => {


			if (parent && parent.type === "Program") {
				if (node.type === "VariableDeclaration") {
					if (
						node.declarations
						&& node.declarations
						&& node.declarations[0].id.type === "Identifier"
						&& node.declarations[0].init
						&& node.declarations[0].init.type === "CallExpression"
						&& node.declarations[0].init.callee.type === "Identifier"
						&& node.declarations[0].init.callee.name === "require"
						&& node.declarations[0].init.arguments
						&& node.declarations[0].init.arguments[0].type === "Literal"
					) {

						let _id = node.declarations[0].id.name
						let q = node.declarations[0].init
						let lit: Literal
						let args = q.arguments[0]
						try {

							if (args.type === "Literal" && (!((args as RegExpLiteral).regex))) {
								lit = args
							} else {
								throw new Error(generate(args))
							}

						} catch
							(e) {
							console.log(js.getRelative())
							throw exports
						}


						let module_specifier = lit.value.toString()
						let wpn: WithPropNames = _imports.getWPN()
						let info = js.getInfoTracker();
						let map = js.getAPIMap()
						let isBuiltin = (built_ins.includes(module_specifier)
							&& (!builtins_funcs.includes(module_specifier)))
 						let api = map.resolveSpecifier(js, module_specifier);
						let isNamespace = false
						// if (api) {
							isNamespace = api.getType() === API_TYPE.named_only
						// }else{
						// 	console.log(`failed to resolve specifier: ${module_specifier} in file ${js.getRelative()} `)
						// }

						if ( js.getRelative().includes('src/format.js')){

						}
						if (js.usesNamed() && (isBuiltin || api.getType() === API_TYPE.named_only) && (!api.isForced())) {
							namedImports(_id, module_specifier, api)
						} else {
							let idecl: ImportDeclaration
							if (isNamespace && (!js.usesNamed()) && (!api.isForced())) {
								idecl = {
									type: "ImportDeclaration",
									source: (node.declarations[0].init.arguments[0] as SimpleLiteral),
									specifiers: [{
										type: "ImportNamespaceSpecifier",
										local: ((node.declarations as VariableDeclarator[])[0] as VariableDeclarator).id as Identifier
									}]

								}
								xImportsY.data[js.getRelative()].push(mod_map
									.resolve(module_specifier , js)+"|namespace");


							} else {
								let  resolved =  mod_map .resolve(module_specifier , js)
								xImportsY.data[js.getRelative()].push(resolved +"|default" +( api && api.isForced()? "-forced":"standard"));

								idecl = {
									type: "ImportDeclaration",
									source: (node.declarations[0].init.arguments[0] as SimpleLiteral),
									specifiers: [{
										type: "ImportDefaultSpecifier",
										local: ((node.declarations as VariableDeclarator[])[0] as VariableDeclarator).id as Identifier
									}]

								}
							}

							_imports.add(idecl);
						}
						//always
						return VisitorOption.Remove;
					}
				} else if (node.type === "ExpressionStatement") {
					if (
						node.expression.type === "CallExpression"
						&& node.expression.callee.type === "Identifier"
						&& node.expression.callee.name === "require"
						&& node.expression.arguments.length
						&& node.expression.arguments[0].type === "Literal"
					) {
						let decl: ImportDeclaration = {
							type: "ImportDeclaration",
							source: (node.expression.arguments[0] as Literal),
							specifiers: []
						}
						_imports.add(decl)
						return VisitorOption.Remove;
					}
				}

			}
		}
	}

	replace(js.getAST(), visitor)
	// _imports.getDeclarations().reverse().forEach(e => {
	// 	js.getAST().body.splice(0, 0, e)
	// })
	replace(js.getAST(), {
		leave: (node, parent) => {

			if (
				node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier"
				&& propNameReplaceMap
				&& propNameReplaceMap[node.object.name]
				&& propNameReplaceMap[node.object.name][node.property.name]
			) {

				let replacement: Identifier = {
					type: "Identifier",
					name: propNameReplaceMap[node.object.name][node.property.name]
				}
				js.getNamespace().addToNamespace(replacement.name)
				return replacement

			}

			// else if (node.type ==="Identifier"
			// && infoTracker.
			// )
		}
	});


	function namedImports(id: string, module_specifier: string, api: API) {

		let wpn: WithPropNames = _imports.getWPN()

		let rpi = info.getRPI(id);

		let specifiers: ImportSpecifier[] = []
		let ns = js.getNamespace()


		let primReport: string[] = []

		// let accessables: string[] = rpi.allAccessedProps// .filter(e => apiexports.includes(e))
		// rpi.allAccessedProps.forEach((e, index, arr) => {
		// 	if (wpn.aliases[module_specifier] && wpn.aliases[module_specifier][e] === e) {
		// 		arr[index] = wpn.aliases[module_specifier][e]
		// 	}
		// });

		function getLocalNamedCopy(accessedProp: string) {
			let local: Identifier
			if (!ns.containsName(accessedProp)) {
				local = {type: "Identifier", name: accessedProp}
				ns.addToNamespace(accessedProp)
			} else {
				local = ns.generateBestName(accessedProp)
			}
			return local;
		}

// rpi.allAccessedProps
		let dataRep = js.getReporter().addMultiLine('used_named_imports')
		rpi.allAccessedProps.forEach((accessedProp: string) => {
			let imported: Identifier
			// if (wpn.aliases[module_specifier] && wpn.aliases[module_specifier][accessedProp] === accessedProp) {
			// 	accessed = {type: "Identifier", name: wpn.aliases[module_specifier][accessedProp]}
			// } else {
			let _id = wpn.fromSpec[module_specifier]
			if (_id) {
				imported = {type: "Identifier", name: accessedProp}
			} else {
				throw new Error('accessed could not find id from spec: ' + module_specifier)
				//js.getNamespace().generateBestName(e)
			}

			let local: Identifier = getLocalNamedCopy(accessedProp);
			let prev: Identifier = local
			if (!propNameReplaceMap[id]) {
				propNameReplaceMap[id] = {}
			}


			//todo determine if this can remove prev
			propNameReplaceMap[id][accessedProp] = local.name
			if (js.usesNamed() && rpi.potentialPrimProps.includes(accessedProp)) {

				prev = createCopy(local)()
				primReport.push(`${prev.name}>>${local.name}`)
			}


			let is: ImportSpecifier = {
				type: "ImportSpecifier",
				local: prev,
				imported: imported
			}
			let resolved = mod_map
				.resolve(module_specifier , js)
			if (!dataRep.data[resolved] ){
				dataRep.data[resolved] =[]
			}
			dataRep.data[resolved].push(`${imported.name}|${js.getRelative()}`)
			specifiers.push(is)

			xImportsY.data[js.getRelative()].push(mod_map
				.resolve(module_specifier , js)+"|named");
		});

		// js.addAnImport
		let decl: ImportDeclaration = {
			type: "ImportDeclaration",
			source: {type: "Literal", value: module_specifier},
			specifiers: specifiers
		}


		_imports.add(decl)
		js.getReporter()
			.addMultiLine(Reporter.copyPrimCount)
			.data[module_specifier] = primReport

		function createCopy(local: Identifier): () => Identifier {
			//TODO introduce second type for default version
			return () => {
				let copy = ns.generateBestName(local.name)
				js.insertCopyByValue(createAliasedDeclarator(copy, local))
				return copy

				function createAliasedDeclarator(copy: Identifier, original: Identifier): VariableDeclaration {
					let relative = js.getRelative()
					let msg = `${copy.name}-${original.name}`

					let declarator: VariableDeclarator = {
						type: "VariableDeclarator",
						id: original,
						init: copy
					}
					let declaration: VariableDeclaration = {
						type: "VariableDeclaration",
						kind: 'var',
						declarations: [declarator]
					}
					return declaration
				}
			}
		}

		// else{
		// 	return ()=>{
		// 		let declarator: VariableDeclarator = {
		// 			type: "VariableDeclarator",
		// 			id: null, // best ,
		// 			init: local
		// 		}
		// 		return null;
		// 	}
		//
		// }
	}

	// }

}


