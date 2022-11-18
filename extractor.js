function extractKeyComp(id, js) {
    String.prototype.substringAfter = function substringAfter(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    String.prototype.substringBefore = function substringBefore(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    String.prototype.substringAfterLast = function substringAfterLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    String.prototype.substringBeforeLast = function substringBeforeLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    String.prototype.onlyOnce = function substringBeforeLast(substring) {
        let str = this;
        return str.lastIndexOf(substring) == str.indexOf(substring);
    }

    function findClosingBraces(str) {
        let output = "";
        let stack = [];
        let brackets = ["(", "["];
        let closingBrackets = [")", "]"];
        let braces = ["\'", "\""];
        let escapedBraces = ["\\\'", "\\\""];
        let lastChar = "";
        for (let i = 0; i < str.length; i++) {
            output += str[i];

            if (brackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.push(str[i]);
            }
            else if (closingBrackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.pop();
            }
            else if (braces.includes(str[i])) {
                if (lastChar == "\\" && escapedBraces.includes(`\\${str[i]}`)) {

                } else {
                    if (str[i] == stack[stack.length - 1]) {
                        stack.pop();
                    } else {
                        stack.push(str[i]);
                    }
                }
            }

            lastChar = str[i];


            if (stack.length == 0) {
                break;
            }
        }
        return output;

    }

    function findFirstBrace(str) {
        let output = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "(") {
                break;
            }
            output += str[i];

        }

        return output;
    }

    function getPassword(js) {

        let regex = /\.\.\..+?=/g;
        let funcName = null;
        let transformDecodeFunc;
        while (match = regex.exec(js)) {
            let tempFuncName = "_0x" + js.substring(0, match.index).substringBeforeLast("=").substringAfterLast("_0x");
            if (!js.onlyOnce(tempFuncName)) {
                funcName = tempFuncName;
                break;
            }
        }
        if (funcName == null) {
            let funcName = js.substringAfter("CryptoJS[").substringBefore(";return").substringAfterLast(",").replace(")", "");
            let otherParams = "[" + js.substringAfter(`${funcName}=[`).substringBefore("('')") + "('')";
            otherParams = otherParams.split(",");
            let decodeFunc = null;
            for (let i = 1; i < otherParams.length; i++) {
                if (otherParams[i][0] == "_") {
                    decodeFunc = findFirstBrace(otherParams[i]);
                    break;
                }
            }
            otherParams = otherParams.join(",");
            funcArgs = {
                "paramString": otherParams,
                "decFuncName": decodeFunc,
                "justEval": true
            };
        } else {


            let otherParams;
            let concatFunc, transformFunc, keyVarName;
            if (id == 4) {
                otherParams = findClosingBraces(js.substringAfter(`${funcName}`));
            } else {
                // let baseString = js.substringAfter(`${funcName}=(`);
                // concatFunc = findClosingBraces("(" + baseString);
                // otherParams = "eval" + findClosingBraces(baseString.substringAfter("eval"));
                // concatFunc = funcName + "=" + concatFunc + "=>" + otherParams + ";";
                keyVarName = "_0x" + js.substringBefore(`=${funcName}`).substringAfterLast("_0x");
                otherParams = findClosingBraces(js.substringAfter(`=${funcName}`));
                let temp = js.substringAfter(`${otherParams}`);
                temp = temp.replace(";return","");

                let transformArray = findClosingBraces(temp);

                temp = temp.substringAfter(transformArray);

                let transformName = findClosingBraces(temp);
                temp = temp.substringAfter(transformName);


                let transformDef = findClosingBraces(temp);



                transformFunc = transformArray + transformName + transformDef;

                let otherParamsTemp = otherParams.substring(1, otherParams.length - 1);
                otherParamsTemp = otherParamsTemp.split(",");
                transformDecodeFunc = findFirstBrace(otherParamsTemp[0]);

                for (let i = 0; i < otherParamsTemp.length; i++) {
                    if (otherParamsTemp[i][0] != "'") {
                        transformDecodeFunc = findFirstBrace(otherParamsTemp[i]);
                    }
                }

            }

            if (id == 6) {
                otherParams = otherParams.substring(1, otherParams.length - 1);
                funcArgs = {
                    "paramString": otherParams,
                    "decFuncName": transformDecodeFunc,
                    "keyVarName" : keyVarName
                };
                funcArgs.transform = true;
                funcArgs.transformFunc = transformFunc;
            } else {
                otherParams = otherParams.substring(1, otherParams.length - 1);
                otherParams = otherParams.split(",");
                let decodeFunc = findFirstBrace(otherParams[0]);
                for (let i = 0; i < otherParams.length; i++) {
                    if (otherParams[i][0] != "'") {
                        decodeFunc = findFirstBrace(otherParams[i]);
                    }
                }

                otherParams = otherParams.join(",");
                funcArgs = {
                    "paramString": otherParams, 
                    "decFuncName": decodeFunc
                };
            }

        }

        return [getPasswordFromJS(js, funcArgs), false];
    }

    function getPasswordFromJS(js, getKeyArgs) {
        var script = js.substringBefore(",(!function") + ")";

        var decoderFunName = js.substringBefore("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=").substringBeforeLast("function").substringBeforeLast("function").substringAfterLast("return").trim().split("=")[0];
        var decoderFunPrefix = "function " + decoderFunName;
        var decoderFunBody = decoderFunPrefix + "(" + js.substringAfter(decoderFunPrefix + "(");
        var decoderFunSuffix = `,${decoderFunName}(`;
        var decoderFunCall = decoderFunSuffix + decoderFunBody
            .substringAfter(decoderFunSuffix)
            .substringBefore(");}") + ");}";
        decoderFunBody = decoderFunBody.substringBefore(decoderFunCall) + decoderFunCall;
        if (!script.substring(0, 20).includes("=[")) {
            var superArrName = decoderFunBody.substringAfter("=").substringBefore(";")
            var superArrPrefix = "function " + superArrName
            var superArrSuffix = "return " + superArrName + ";}"
            var superArrBody = superArrPrefix + js.substringAfter(superArrPrefix)
                .substringBefore(superArrSuffix) + superArrSuffix
            script += "\n" + superArrBody + "\n"
        }

        script += "\n" + decoderFunBody
        decoderFunc = decoderFunName;

        if (typeof getKeyArgs == "string") {
            script += `\n${decoderFunName}${getKeyArgs}`;
        } else if (getKeyArgs.justEval) {
            script += `var ${getKeyArgs.decodeFunc} = ${decoderFunName};`;
            script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
        } else {
            if (getKeyArgs.splice) {
                script += getKeyArgs.concatFunc;
                script += getKeyArgs.concatFuncName + `(${getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName)})`;
            } else if (getKeyArgs.transform) {
                script += "\nlet tempArray = [";
                script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
                script += "];";
                script += "let key = tempArray.join('');";
                script += getKeyArgs.transformFunc.replaceAll(getKeyArgs.decFuncName, decoderFunName).replaceAll(getKeyArgs.keyVarName, "key");
                script += ";key";
            } else {
                script += "\nlet tempArray = [";
                script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
                script += "];";
                script += "tempArray.join('')";
            }

        }


        return (script);
    }


    return getPassword(js);
}
module.exports.execute = extractKeyComp
