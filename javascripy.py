#!/usr/bin/env python
# -*- coding: utf-8 -*-


'''convert javascript (.js) to syntax in python style (.jspy, without brackets, semicolons), there and back


as MODULE:

import javascripy
  and run:

javascripy.couple([dir='.'])             create missing pair files in the directory
javascripy.djp([dir='.', rewrite=True])  convert files in directory from .js to .jspy
javascripy.dpj([dir='.', rewrite=True])  convert files in directory from .jspy to .js
javascripy.jp(pathname)                  convert file from .js to .jspy (both can be used: pathname or pathname.js)
javascripy.pj(pathname)                  convert file from .jspy to .js (both can be used: pathname or pathname.jspy)


as SCRIPT:

./javascripy.py [file|dir]
python javascripy.py [file|dir]
  if file (with extension), it will compile the file to the 2nd format (.js->.jspy or .jspy->.js)
  if no parameter or dir, it will run couple(): create missing pair files for .js and .jspy files in the [dir] directory (or in current directory)

so you can auto-compile files:
  chmod +777 /usr/local/bin/javascripy.py
  apt-get install incron
  edit /etc/incron.allow to name allowed users (one user per line)
  # configure your editor in /etc/incron.conf or learn vim minimum: INS (to edit), ESC :wq ENTER (to save & quit)
  incrontab -e
    /home/username/static/js IN_CLOSE_WRITE /usr/local/bin/javascripy.py $@/$#
  service incron start
'''


# __maintainer__ = "Mirek Zvolsky"
# __github__ = "github.com/zvolsky"
# __email__ = "zvolsky@seznam.cz, mirek.zvolsky@gmail.com"

import os
import sys

EXT_js = 'js'          # default extension for javascript files
EXT_jspy = 'jspy'      # default extension for javascripy files




#----------------------------------------------------------------------------------------------------------------------
def compile_string_pj(strin):
    return strin

def compile_string_jp(strin):
    return strin

def compile_file_pj(pathname):
    '''compile file from javascripy (with or without .jspy extension) to javascript'''
    compile_file(pathname, EXT_jspy, EXT_js, compile_string_pj)

def compile_file_jp(pathname):
    '''compile file from javascript (with or without .js extension) to javascripy'''
    compile_file(pathname, EXT_js, EXT_jspy, compile_string_jp)

def compile_file(pathname, extin=EXT_jspy, extout=EXT_js, compile_func=compile_string_pj):
    '''compile file from or to javascripy
    use if filename stem should be same for source and target but with different extensions
    '''
    def fix_pathname(pathname, ext, ext_remove=None):
        ext = fix_ext(ext)
        if pathname[-len(ext):] != ext:
            if ext_remove:
                ext_remove = fix_ext(ext_remove)
                ext_pos = -len(ext_remove)
                if pathname[ext_pos:] == ext_remove:
                    pathname = pathname[:ext_pos]
            pathname += ext
        return pathname

    compile(fix_pathname(pathname, extin), fix_pathname(pathname, extout, ext_remove=extin), compile_func)

def compile(pathname_in, pathname_out, compile_func=compile_string_pj):
    '''compile file from or to javascripy
    use if you want enter full filenames (not stem together with extensions)
    '''
    with open(pathname_in, 'rb') as f:
        strin = f.read()
    with open(pathname_out, 'w') as f2:
        f2.write(compile_func(strin))

def couple(dir='.', ext_js=EXT_js, ext_jspy=EXT_jspy):
    '''create missing pair files for all files inside the directory'''
    compile_dir_jp(dir, rewrite=False)
    compile_dir_pj(dir, rewrite=False)

def compile_dir_jp(dir='.', ext_js=EXT_js, ext_jspy=EXT_jspy, rewrite=True):
    '''compile all files in directory from javascript to javascripy'''
    compile_dir(dir, extin=ext_js, extout=ext_jspy, compile_func=compile_string_jp, rewrite=rewrite)
    
def compile_dir_pj(dir='.', ext_jspy=EXT_jspy, ext_js=EXT_js, rewrite=True):
    '''compile all files in directory from javascripy to javascript'''
    compile_dir(dir, extin=ext_jspy, extout=ext_js, compile_func=compile_string_pj, rewrite=rewrite)

def compile_dir(dir='.', extin=EXT_jspy, extout=EXT_js, compile_func=compile_string_pj, rewrite=True):
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

def fix_ext(ext):
    if ext[0] != '.':
        ext = '.' + ext
    return ext

jp = fjp = compile_file_jp
pj = fpj = compile_file_pj
sjp = compile_string_jp
spj = compile_string_pj
djp = compile_dir_jp
dpj = compile_dir_pj


if __name__=='__main__':
    if '--help' in sys.argv:
        print __doc__
    else:
        fsname = sys.argv[1] if len(sys.argv)>1 else '.'
        if os.path.isfile(fsname):
            ext_js = fix_ext(EXT_js)
            if fsname[-len(ext_js):]==ext_js:
                jp(fsname)                      # compile .js -> .jspy
            else:
                ext_jspy = fix_ext(EXT_jspy)
                if fsname[-len(ext_jspy):]==ext_jspy:
                    pj(fsname)                  # compile .jspy -> .js
        elif os.path.isdir(fsname):
            couple(fsname)                      # create all missing pair files in directory