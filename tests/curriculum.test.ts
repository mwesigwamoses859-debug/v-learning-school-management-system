import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ALL_CLASSES,ALL_SUBJECTS,getSubjectsForClass,parseClassName,getNextClassName} from '../src/curriculum';
test('secondary classes expose the Ugandan O-Level and A-Level subject menus separately',()=>{
 for(const name of ['S.1','S.2','S.3','S.4','S.5','S.6'])assert.ok(ALL_CLASSES.includes(name as any));
 for(const cls of ['S.1','S.2','S.3','S.4'] as const){const subjects=getSubjectsForClass(cls);for(const subject of ['English Language','History and Political Education','Kiswahili','Physical Education','Luganda','Information and Communication Technology (ICT)'])assert.ok(subjects.includes(subject));assert.ok(!subjects.includes('Subsidiary Mathematics'));}
 for(const cls of ['S.5','S.6'] as const){const subjects=getSubjectsForClass(cls);for(const subject of ['General Paper','Subsidiary Mathematics','Subsidiary ICT','Economics','History','Principal ICT','Foods and Nutrition'])assert.ok(subjects.includes(subject));assert.ok(!subjects.includes('History and Political Education'));}
 assert.ok(ALL_SUBJECTS.includes('CRE / IRE'),'existing staff subject labels remain recognised');
 assert.ok(!getSubjectsForClass('P.7').includes('General Paper'),'primary remains separate');
});

test('secondary imports keep their level and promotions follow secondary classes',()=>{
 for(const [input,expected] of [['s1','S.1'],['S.6','S.6'],['Senior Four','S.4'],['Secondary 5','S.5'],['P7','P.7'],['Primary Three','P.3']])assert.equal(parseClassName(input),expected);
 for(const input of ['S7','P8','Senior 0','unknown',''])assert.equal(parseClassName(input),null);
 for(const [from,to]of [['S.1','S.2'],['S.2','S.3'],['S.3','S.4'],['S.4','S.5'],['S.5','S.6'],['S.6','Graduated'],['P.7','Graduated']])assert.equal(getNextClassName(from as any),to);
});
