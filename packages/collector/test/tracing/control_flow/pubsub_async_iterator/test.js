'use strict';

const expect = require('chai').expect;

const supportedVersion = require('@instana/core').tracing.supportedVersion;
const config = require('../../../config');

describe('tracing/graphql-subscriptions - PubSub/async iterator (pull before push)', function() {
  if (!supportedVersion(process.versions.node)) {
    return;
  }

  const agentControls = require('../../../apps/agentStubControls');
  const Controls = require('./controls');

  this.timeout(config.getTestTimeout());

  agentControls.registerTestHooks();

  const controls = new Controls({
    agentControls
  });
  controls.registerTestHooks();

  it('should keep cls context when pulling before pushing', () => {
    return controls
      .sendRequest({
        method: 'GET',
        path: '/pull-before-push'
      })
      .then(valuesReadFromCls => {
        expect(valuesReadFromCls).to.have.lengthOf(3);
        expect(valuesReadFromCls[0]).to.equal('test-value');
        expect(valuesReadFromCls[1]).to.equal('test-value');
        expect(valuesReadFromCls[2]).to.equal('test-value');
      });
  });
});
