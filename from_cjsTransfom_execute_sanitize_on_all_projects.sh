./clean ;

 for file in `ls  /Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/real_projects `; 
 do src/transformations/sanitizing/sanitize_project.ts  ./real_projects/$file ./real_san/$file  ;
 done;
