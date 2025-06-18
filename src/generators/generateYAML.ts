import yaml from 'js-yaml';

export function parseYAML(firmwareInJSON: any) {
    console.log(yaml.dump(firmwareInJSON));
    return yaml.dump(firmwareInJSON)
        .replace(/^(\s*\w+):\s*\|-\n\s*__LAMBDA_BLOCK__\n/gm, '$1: !lambda |-\n')
        .replace(/__LAMBDA_BLOCK__/g, '|-\n')
        .replace(/^(\s*- lambda: )return (.+);$/gm, (_, prefix, body) => {
            return `${prefix}'return ${body};'`;
        })
        .replace(/null/g, '')
        .replace(/'no'/g, 'no')
        .replace(/'0x[0-9a-fA-F]+'/g, (match) => match.slice(1, -1));
    ;
}