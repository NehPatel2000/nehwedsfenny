import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildInvitationItem, getSelectedIds, parseCsv, parseInvitationsCsv } from './import-rsvp-invitations.mjs';

describe('parseCsv', () => {
  it('handles quoted commas, escaped quotes, and CRLF', () => {
    assert.deepEqual(parseCsv('familyName,member1\r\n"Patel, Family","A ""Ace"" Patel"\r\n'), [
      ['familyName', 'member1'],
      ['Patel, Family', 'A "Ace" Patel'],
    ]);
  });

  it('handles the UTF-8 BOM produced by some spreadsheet exports', () => {
    assert.deepEqual(parseCsv('\uFEFFfamilyName,member1\nFamily,Alice'), [
      ['familyName', 'member1'],
      ['Family', 'Alice'],
    ]);
  });

  it('rejects unclosed quoted values', () => {
    assert.throws(() => parseCsv('familyName,member1\n"Family,Guest'), /unclosed quoted field/);
  });
});

describe('parseInvitationsCsv', () => {
  it('parses family invitations with optional tokens and skips blank guest cells', () => {
    assert.deepEqual(parseInvitationsCsv(
      'familyName,member1,member2,token\nPatel Family,Alice,Bob,\nShah Family,Carol,,AbCdEf1234\n'
    ), [
      {
        familyName: 'Patel Family',
        members: [
          { id: 'member-1', name: 'Alice' },
          { id: 'member-2', name: 'Bob' },
        ],
        token: '',
      },
      {
        familyName: 'Shah Family',
        members: [{ id: 'member-1', name: 'Carol' }],
        token: 'AbCdEf1234',
      },
    ]);
  });

  it('requires a family name, a guest, and consecutive member columns', () => {
    assert.throws(() => parseInvitationsCsv('familyName,member2\nFamily,Alice'), /consecutive/);
    assert.throws(() => parseInvitationsCsv('familyName,member1\nFamily,'), /at least one guest/);
    assert.throws(() => parseInvitationsCsv('familyName,member1\nFamily,Alice\nBad,'), /row 3/);
  });
});

describe('getSelectedIds', () => {
  it('preserves existing choices, selects new or renamed guests, and drops removed guests', () => {
    const previousItem = {
      members: {
        L: [
          { M: { id: { S: 'member-1' }, name: { S: 'Alice' } } },
          { M: { id: { S: 'member-2' }, name: { S: 'Bob' } } },
          { M: { id: { S: 'member-3' }, name: { S: 'Carol' } } },
        ],
      },
      attendingDay1: { L: [{ S: 'member-2' }, { S: 'member-3' }] },
    };

    assert.deepEqual(getSelectedIds(previousItem, 'attendingDay1', [
      { id: 'member-1', name: 'Alice' },
      { id: 'member-2', name: 'Bob' },
      { id: 'member-3', name: 'New guest' },
      { id: 'member-4', name: 'David' },
    ]), ['member-2', 'member-3', 'member-4']);
  });

  describe('buildInvitationItem', () => {
    it('does not persist default attendance before the family submits', () => {
      const item = buildInvitationItem('Patel Family', [
        { id: 'member-1', name: 'Alice' },
        { id: 'member-2', name: 'Bob' },
      ]);

      assert.equal(item.familyName.S, 'Patel Family');
      assert.equal(item.members.L.length, 2);
      assert.equal('attendingDay1' in item, false);
      assert.equal('attendingDay2' in item, false);
    });

    it('keeps attendance unset when an invitation is edited before its first response', () => {
      const unsubmittedItem = {
        members: {
          L: [{ M: { id: { S: 'member-1' }, name: { S: 'Alice' } } }],
        },
      };
      const updatedItem = buildInvitationItem('Updated Family', [
        { id: 'member-1', name: 'Alice' },
        { id: 'member-2', name: 'Bob' },
      ], unsubmittedItem);

      assert.equal('attendingDay1' in updatedItem, false);
      assert.equal('attendingDay2' in updatedItem, false);
    });
  });
});
