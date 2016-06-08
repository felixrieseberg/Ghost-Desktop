# Developer Environment

In order to get up and running with Ghost Desktop, follow the guide below to install [all dependencies for Ghost Desktop development work](#prerequisites-and-dependencies). Then, to confirm that your setup works:

 * Clone this repository
 * Run `npm install` to install all Node dependencies
 * Run `bower install` to install all Bower dependencies
 * Run `npm install -g grunt-cli` to install the Grunt Cli, which is used to test and build Ghost Desktop
 * Run `npm run build-native-deps-64` (or -32, if you're running on a 32 bit machine) to rebuild native C++ dependencies against the Electron headers
 * Run `npm start` to compile and start Ghost Desktop
 
 
 ## Prerequisites and Dependencies
 * Node (`v6.0` or newer), since that's the version Electron is using internally. If you're also developing on Ghost, use a tool like [nvm][nvm] or [nvm-windows][nvm-windows] to manage multiple Node versions. 
 * npm (`v3` or newer)
 * Python ([`v2.7.10`][python-v2.7.10] recommended, `v3.x.x` is __*not*__ supported)
    * Make sure that you have a PYTHON environment variable, and it is set to `drive:\path\to\python.exe`, not to a folder
 

### Windows
It's heavily recommended that you develop on Windows 10 - it has numerous performance and convenience improvements over Windows 8.1 that will make your life easier. If you're still on Windows 7 or Vista, you might be able to get it running with the instructions below, but you're basically on your own.


##### Windows 10
* Install Python 2.7 from https://www.python.org/download/releases/2.7/ and make sure its on the System Path
* Install Visual Studio Community 2015 Edition. (Custom Install, Select Visual C++ during the installation)
* Set the environment variable GYP_MSVS_VERSION=2015
* Run the command prompt as Administrator
* If the above steps have not worked or you are unsure please visit http://www.serverpals.com/blog/building-using-node-gyp-with-visual-studio-express-2015-on-windows-10-pro-x64 for a full walkthrough


##### Older Windows Versions:
* Microsoft Visual Studio C++ 2013 ([Express][msvc2013] version works well)
* If the install fails, try uninstalling any C++ 2010 x64&x86 Redistributable that you have installed first
* If you get errors that the 64-bit compilers are not installed you may also need the [compiler update for the Windows SDK 7.1]

```
call "C:\Program Files\Microsoft SDKs\Windows\v7.1\bin\Setenv.cmd" /Release /x86
call "C:\Program Files\Microsoft SDKs\Windows\v7.1\bin\Setenv.cmd" /Release /x64
```

### Mac OS X / Unix
* `python` (`v2.7` recommended, `v3.x.x` is __*not*__ supported)
* `make`
* A proper C/C++ compiler toolchain, like [GCC](https://gcc.gnu.org). It's automatically installed with the XCode command line tools, which you can find  under the menu `Xcode -> Preferences -> Downloads`

If you have multiple Python versions installed, you can identify which Python
version `node-gyp` uses by setting the '--python' variable:

``` bash
$ node-gyp --python /path/to/python2.7
```

If `node-gyp` is called by way of `npm` *and* you have multiple versions of
Python installed, then you can set `npm`'s 'python' config key to the appropriate
value:

``` bash
$ npm config set python /path/to/executable/python2.7
```
##### Ubuntu
On Ubuntu, please make sure that you have `node-gyp` and `libgnome-keyring-dev` installed.

[python-v2.7.10]: https://www.python.org/downloads/release/python-2710/
[msvc2013]: https://www.microsoft.com/en-gb/download/details.aspx?id=44914
[win7sdk]: https://www.microsoft.com/en-us/download/details.aspx?id=8279
[compiler update for the Windows SDK 7.1]: https://www.microsoft.com/en-us/download/details.aspx?id=4422
[nvm]:https://github.com/creationix/nvm
[nvm-windows]:https://github.com/coreybutler/nvm-windows
