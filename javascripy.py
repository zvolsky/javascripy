#!/usr/bin/python
# -*- coding: utf-8 -*-

import os

ext_js = 'js'                # default extension for javascript files
ext_jspy = 'jspy'      # default extension for javascripy files

def compile_string_pj(strin):
    return strin

def compile_string_jp(strin):
    return strin

def compile_file_pj(filename):
    '''compile file from javascripy to javascript'''
    compile_file(filename, ext_jspy, ext_js, compile_string_pj)

def compile_file_jp(filename):
    '''compile file from javascript to javascripy'''
    compile_file(filename, ext_jspy, ext_js, compile_string_jp)

def compile_file(pathname, extin=ext_jspy, extout=ext_js, compile_func=compile_string_pj):
    '''compile file from or to javascripy
    use if filename stem should be same for source and target but with different extensions
    '''
    def fix_pathname(pathname, ext):
        if ext[0] != '.':
            ext = '.' + ext
        if pathname[-len(ext)] != ext:
            pathname += ext
        return pathname

    compile(fix_pathname(pathname, extin), fix_pathname(pathname, extout), compile_func)

def compile(pathname_in, pathname_out, compile_func=compile_string_pj):
    '''compile file from or to javascripy
    use if you want enter full filenames (not stem together with extensions)
    '''
    with open(pathname_in, 'rb') as f:
        strin = f.read()
    with open(pathname_out, 'w') as f2:
        f2.write(compile_func(strin))

def couple(dir='.', ext_js=ext_js, ext_jspy=ext_jspy):
    '''create missing pair files for all files inside the directory'''
    compile_dir_jp(dir, rewrite=False)
    compile_dir_pj(dir, rewrite=False)

def compile_dir_jp(dir='.', ext_js=ext_js, ext_jspy=ext_jspy, rewrite=True):
    '''compile all files in directory from javascript to javascripy'''
    compile_dir(dir, extin=ext_js, extout=ext_jspy, compile_func=compile_string_jp, rewrite=rewrite)
    
def compile_dir_pj(dir='.', ext_jspy=ext_jspy, ext_js=ext_js, rewrite=True):
    '''compile all files in directory from javascripy to javascript'''
    compile_dir(dir, extin=ext_jspy, extout=ext_js, compile_func=compile_string_pj, rewrite=rewrite)

def compile_dir(dir='.', extin=ext_jspy, extout=ext_js, compile_func=compile_string_pj, rewrite=True):
    '''compile all files in directory there or back (by default from javascripy to javascript)'''
    if extin==extout:
        raise ValueError
    filenames = os.listdir(dir)
    for filename in filenames:
        if extin and filename.endswith('.' + extin) or not extin and not '.' in filename:
            targetstem = filename.split('.', 1)[0]
            if extout:
                targetname = targetstem + '.' + extout
            if rewrite or not targetname in filenames:
                pathstem = os.path.join(dir, targetstem)
                pathname = os.path.join(dir, targetname)
                if os.path.isfile(pathname):
                    os.remove(pathname)
                compile_file(pathstem, extin=extin, extout=extout, compile_func=compile_func)              

jp = fjp = compile_file_jp
pj = fpj = compile_file_pj
sjp = compile_string_jp
spj = compile_string_pj
djp = compile_dir_jp
dpj = compile_dir_pj


if __name__=='__main__':
    couple()