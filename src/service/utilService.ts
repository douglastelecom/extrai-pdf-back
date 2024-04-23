export class UtilService{
    extractValuesFromErrorMaximumContent(errorMessage: any) {
        const regex = /This model's maximum context length is (\d+) tokens\. However, your messages resulted in (\d+) tokens\./;
        const match = errorMessage.match(regex);
        if (!match || match.length < 3) {
            throw new Error('Erro ao extrair valores da mensagem de erro');
        }
        const maxContextLength = parseInt(match[1], 10);
        const resultedTokens = parseInt(match[2], 10);
        return { maxContextLength, resultedTokens };
    }

    reduceTextLength(maxToken: number, currentToken: number, text: string) {
        const ratioToken = (maxToken / currentToken) - 0.05
        const textReduced = text.slice(0, Math.ceil(text.length * ratioToken))
        console.log("Tamanho do texto reduzido para " + (ratioToken*100)+ "%")
        return textReduced
    }
}