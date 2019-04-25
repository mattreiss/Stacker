#include "Stacker.jsx"

function getArgs(argv) {
    var args = []
    for (var i = 2; i < argv.length; i++) args.push(argv[i]);
    return args;
}

function main(argv) {
    if (argv == null || argv.length < 2) {
        return "missing arguments";
    }
    var directory = argv[0];
    var command = argv[1];
    var args = getArgs(argv);
    switch (command) {
        case "Stacker": return Stacker(args)
    }
    return "command not found"
}
