function replaceToHTMLString(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += replaceToHTMLChar(str[i]);
    }
    return result.trim();
}

function replaceToHTMLChar(char) {
    let specialChars = ["&", "<", ">", "#", "|", '"', "'", "´", "!", "\n", "{", "}", "(", ")", "[", "]"];
    let specialCharDict = {
        "&": "&amp",
        "<": "&lt;",
        ">": "&gt;",
        "#": "&num;",
        "|": "&vert;",
        '"': "&quot",
        "'": "&apos;",
        "´": "&acute;",
        "!": "&excl;",
        "\n": "<br>",
        "{": "&lbrace;",
        "}": "&rbrace;",
        "(": "&lpar;",
        ")": "&rpar;",
        "[": "&lbrack;",
        "]": "&rbrack;"

    }
    if (specialChars.includes(char)) {
        return specialCharDict[char];
    } else {
        return char;
    }
}

exports.toHTML = replaceToHTMLString;