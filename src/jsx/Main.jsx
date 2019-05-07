#include "Stacker.jsx"
#include "Compress.jsx"

#include "Util Scripts Only/FileUtil.jsx"
#include "Util Scripts Only/StringUtil.jsx"
#include "Util Scripts Only/LayerUtil.jsx"
#include "Util Scripts Only/JsonUtil.jsx"
#include "Util Scripts Only/ArrayUtil.jsx"
#include "Util Scripts Only/LogUtil.jsx"

#include "Options Scripts Only/StackerOptions.jsx"

#include "Support Scripts Only/StackSupport.jsx"
#include "Support Scripts Only/Terminology.jsx"

function main(args) {
    if (args == null || args.length < 2) {
        return "missing arguments";
    }
    var directory = args[0];
    var command = args[1];
    args = ArrayUtil.shift(args, 2);
    Log.info("Main.jsx: args = " + args[0] + " " + args[1])
    return;
    switch (command) {
        case "Compress": return Compress(args);
        case "Stacker": return Stacker(args);
    }
    return "command not found"
}
