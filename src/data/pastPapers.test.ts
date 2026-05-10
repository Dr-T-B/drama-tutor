import test from 'node:test'
import assert from 'node:assert'
import { getQuotesForTheme } from './pastPapers'
import type { Play } from './pastPapers'

test('getQuotesForTheme', async (t) => {
  await t.test('returns quotes for a valid theme and play combination', () => {
    // 'uncertainty' is a theme for 'HAM'
    const quotes = getQuotesForTheme('uncertainty', 'HAM')
    assert.ok(quotes.length > 0, 'Should return at least one quote')
    assert.strictEqual(
      quotes[0].text,
      'The time is out of joint. O cursèd spite / That ever I was born to set it right.'
    )
  })

  await t.test('returns an empty array for a non-existent theme', () => {
    const quotes = getQuotesForTheme('fake-theme-that-does-not-exist', 'HAM')
    assert.deepStrictEqual(quotes, [])
  })

  await t.test('returns an empty array when the theme exists but not for the specified play', () => {
    // We assume 'uncertainty' is only for 'HAM'. Let's verify that.
    // If it's also for DUCHESS, this test will fail, and we can adjust.
    // Given the previous grep output, 'uncertainty' was plays: ['HAM'].
    const quotes = getQuotesForTheme('uncertainty', 'DUCHESS' as Play)
    assert.deepStrictEqual(quotes, [])
  })
})
