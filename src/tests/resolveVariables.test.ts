import { getTypeVariable } from '../helpers/helpers';

const exampleCode = `
const theString = 'Santos'
const cocamar = 123
const juliana = false
const santana = true
const theStringTwo = "Santos"
const theStringThree = \`Santos\`
`;

describe('Suite', () => {
  it('resolve string', () => {
    const data = getTypeVariable('theString', exampleCode);
    expect(data).toStrictEqual({ content: 'Santos', type: 'string' });
  });

  it('resolve string duple', () => {
    const data = getTypeVariable('theStringTwo', exampleCode);
    expect(data).toStrictEqual({ content: 'Santos', type: 'string' });
  });

  it('resolve string crasis???', () => {
    const data = getTypeVariable('theStringThree', exampleCode);
    expect(data).toStrictEqual({ content: 'Santos', type: 'string' });
  });

  it('resolve number', () => {
    const data = getTypeVariable('cocamar', exampleCode);
    expect(data).toStrictEqual({ content: 123, type: 'number' });
  });

  it('resolve boolean false', () => {
    const data = getTypeVariable('juliana', exampleCode);
    expect(data).toStrictEqual({ content: false, type: 'boolean' });
  });

  it('resolve boolean true', () => {
    const data = getTypeVariable('santana', exampleCode);
    expect(data).toStrictEqual({ content: true, type: 'boolean' });
  });
});
