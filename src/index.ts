import { extractDataFromTests } from './extractDataFromTests';

function mountDocWorkingAllTests(rawDoc: any) {
  const docMounted = [];
  rawDoc.forEach((doc: any) => {
    const docObjectIsNotMounted = docMounted[doc.routerRequest]?.[doc.typeMethod] !== undefined;
    if (docObjectIsNotMounted) {
      docMounted[doc.routerRequest][doc.typeMethod].tests.push(doc);
    } else {
      const docRouterObjectIsNotMounted = !docMounted[doc.routerRequest];
      if (docRouterObjectIsNotMounted) {
        docMounted[doc.routerRequest] = {};
      }

      docMounted[doc.routerRequest][doc.typeMethod] = { context: '', tests: [doc] };
    }
  });

  return { ...docMounted };
}

export default function generateDocFile() {
  const dirFile = './src/test/user.test.ts';

  const docFile = extractDataFromTests(dirFile);
  return mountDocWorkingAllTests(docFile);
}
