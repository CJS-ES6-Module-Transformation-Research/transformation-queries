Object.defineProperty(exports, "__esModule", { value: true });
var project_representation_1 = require("../../abstract_representation/project_representation");
var Transformer_1 = require("../Transformer");
var visitors_1 = require("./visitors");
var index_1 = require("../../../index");
var jsonRequire_1 = require("../../../src/transformations/sanitizing/visitors/jsonRequire");
var arg1 = index_1.test_root + "_2";
console.log("script start");
arg1 = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_proj";
// arg1 = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_proj_inPLace`
// arg1 = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/sanitize/qccess_replace/accessFiles`
var project = project_representation_1.projectReader(arg1);
console.log("finished reading in");
var transformer = Transformer_1.Transformer.ofProject(project);
console.log('about to tf0');
transformer.transform(visitors_1.requireStringSanitizer);
transformer.transform(jsonRequire_1.jsonRequire(project));
console.log('about to tf1');
//
// transformer.transform(flattenDecls)
// console.log('about to tf2')
// transformer.transform(accessReplace);
// console.log('about to tf3')
//
// transformer.transform(collectDefaultObjectAssignments);
// console.log('about to write out')
// // project.display()
var writeTarget = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/fixtures/json';
// rmdirSync(writeTarget,{recursive:true});
project.writeOutNewDir(writeTarget);
// project.writeOutInPlace('.X')
console.log('post-writeout');
