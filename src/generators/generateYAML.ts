import yaml from 'js-yaml';

export function parseYAML(firmwareInJSON: any){
    return yaml.dump(firmwareInJSON).replace(
        /^(\s*\w+):\s*\|-\n\s*__LAMBDA_BLOCK__\n/gm,
        '$1: !lambda |-\n'
    );
}