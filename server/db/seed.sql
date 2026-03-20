-- Seed challenges
INSERT INTO challenges (title, slug, description, examples, constraints_text, difficulty, topic, starter_code) VALUES
(
  'Two Sum',
  'two-sum',
  E'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer as two space-separated indices.',
  '[{"input": "4\n2 7 11 15\n9", "output": "0 1", "explanation": "Because nums[0] + nums[1] == 9, we return 0 1."}]',
  E'- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- Only one valid answer exists.',
  'easy',
  'arrays',
  '{"python": "# Read input and solve\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(''line'', l => lines.push(l));\nrl.on(''close'', () => {\n  const n = parseInt(lines[0]);\n  const nums = lines[1].split('' '').map(Number);\n  const target = parseInt(lines[2]);\n  // Your solution here\n});\n", "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    // Your solution here\n    return 0;\n}\n"}'
),
(
  'Reverse String',
  'reverse-string',
  E'Write a function that reverses a string. The input string is given as a single line.\n\nPrint the reversed string.',
  '[{"input": "hello", "output": "olleh", "explanation": "The reverse of hello is olleh."}]',
  E'- 1 <= s.length <= 10^5\n- s consists of printable ASCII characters.',
  'easy',
  'strings',
  '{"python": "s = input()\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on(''line'', (s) => {\n  // Your solution here\n});\n", "cpp": "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Your solution here\n    return 0;\n}\n"}'
),
(
  'FizzBuzz',
  'fizzbuzz',
  E'Given an integer `n`, print each number from 1 to n on a new line. But for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both 3 and 5 print "FizzBuzz".',
  '[{"input": "15", "output": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "explanation": "Numbers 3,6,9,12 are multiples of 3. Numbers 5,10 are multiples of 5. 15 is a multiple of both."}]',
  E'- 1 <= n <= 10^4',
  'easy',
  'math',
  '{"python": "n = int(input())\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on(''line'', (line) => {\n  const n = parseInt(line);\n  // Your solution here\n});\n"}'
),
(
  'Palindrome Check',
  'palindrome-check',
  E'Given a string `s`, determine if it is a palindrome. Print "true" if it is, "false" otherwise.\n\nA palindrome reads the same forward and backward. Consider only alphanumeric characters and ignore case.',
  '[{"input": "A man, a plan, a canal: Panama", "output": "true", "explanation": "After removing non-alphanumeric chars and lowercasing: amanaplanacanalpanama is a palindrome."}]',
  E'- 1 <= s.length <= 2 * 10^5\n- s consists of printable ASCII characters.',
  'easy',
  'strings',
  '{"python": "s = input()\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on(''line'', (s) => {\n  // Your solution here\n});\n"}'
),
(
  'Maximum Subarray',
  'maximum-subarray',
  E'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and print that sum.\n\nFirst line: n (size of array)\nSecond line: n space-separated integers',
  '[{"input": "9\n-2 1 -3 4 -1 2 1 -5 4", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum = 6."}]',
  E'- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4',
  'medium',
  'arrays',
  '{"python": "n = int(input())\nnums = list(map(int, input().split()))\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(''line'', l => lines.push(l));\nrl.on(''close'', () => {\n  const n = parseInt(lines[0]);\n  const nums = lines[1].split('' '').map(Number);\n  // Your solution here\n});\n"}'
),
(
  'Valid Parentheses',
  'valid-parentheses',
  E'Given a string `s` containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.\n\nPrint "true" if valid, "false" otherwise.\n\nA string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.',
  '[{"input": "()", "output": "true", "explanation": "A single pair of matching parentheses."}, {"input": "([)]", "output": "false", "explanation": "The brackets are not closed in the correct order."}]',
  E'- 1 <= s.length <= 10^4\n- s consists of parentheses only.',
  'easy',
  'stacks',
  '{"python": "s = input()\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on(''line'', (s) => {\n  // Your solution here\n});\n"}'
),
(
  'Merge Two Sorted Lists',
  'merge-sorted-lists',
  E'Given two sorted arrays of integers, merge them into a single sorted array.\n\nInput:\n- First line: n (size of first array)\n- Second line: n space-separated integers (sorted)\n- Third line: m (size of second array)\n- Fourth line: m space-separated integers (sorted)\n\nOutput: The merged sorted array as space-separated integers.',
  '[{"input": "3\n1 2 4\n3\n1 3 4", "output": "1 1 2 3 4 4", "explanation": "Merging [1,2,4] and [1,3,4] gives [1,1,2,3,4,4]."}]',
  E'- 0 <= n, m <= 50\n- -100 <= values <= 100\n- Both arrays are sorted in non-decreasing order.',
  'easy',
  'arrays',
  '{"python": "n = int(input())\na = list(map(int, input().split())) if n > 0 else []\nm = int(input())\nb = list(map(int, input().split())) if m > 0 else []\n# Your solution here\n"}'
),
(
  'Longest Substring Without Repeating',
  'longest-substring',
  E'Given a string `s`, find the length of the longest substring without repeating characters.\n\nPrint the length.',
  '[{"input": "abcabcbb", "output": "3", "explanation": "The answer is abc, with length 3."}, {"input": "bbbbb", "output": "1", "explanation": "The answer is b, with length 1."}]',
  E'- 0 <= s.length <= 5 * 10^4\n- s consists of English letters, digits, symbols and spaces.',
  'medium',
  'strings',
  '{"python": "s = input()\n# Your solution here\n", "javascript": "const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on(''line'', (s) => {\n  // Your solution here\n});\n"}'
),
(
  'Binary Search',
  'binary-search',
  E'Given a sorted array of integers `nums` and an integer `target`, return the index of target if found, otherwise return -1.\n\nInput:\n- First line: n (size of array)\n- Second line: n space-separated sorted integers\n- Third line: target integer\n\nOutput: The index of target, or -1.',
  '[{"input": "6\n-1 0 3 5 9 12\n9", "output": "4", "explanation": "9 exists in nums and its index is 4."}]',
  E'- 1 <= nums.length <= 10^4\n- -10^4 < nums[i], target < 10^4\n- All integers in nums are unique.\n- nums is sorted in ascending order.',
  'easy',
  'searching',
  '{"python": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Your solution here\n"}'
),
(
  'Climbing Stairs',
  'climbing-stairs',
  E'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nPrint the number of ways.',
  '[{"input": "2", "output": "2", "explanation": "There are two ways: 1+1 and 2."}, {"input": "3", "output": "3", "explanation": "There are three ways: 1+1+1, 1+2, and 2+1."}]',
  E'- 1 <= n <= 45',
  'easy',
  'dp',
  '{"python": "n = int(input())\n# Your solution here\n"}'
),
(
  'Container With Most Water',
  'container-with-most-water',
  E'Given n non-negative integers `a1, a2, ..., an` where each represents a point at coordinate `(i, ai)`. Find two lines which together with the x-axis forms a container that holds the most water.\n\nPrint the maximum amount of water a container can store.\n\nInput:\n- First line: n\n- Second line: n space-separated integers',
  '[{"input": "9\n1 8 6 2 5 4 8 3 7", "output": "49", "explanation": "The max area is between index 1 (height 8) and index 8 (height 7): min(8,7) * (8-1) = 49."}]',
  E'- n >= 2\n- 0 <= height[i] <= 10^4',
  'medium',
  'arrays',
  '{"python": "n = int(input())\nheights = list(map(int, input().split()))\n# Your solution here\n"}'
),
(
  'Longest Common Subsequence',
  'longest-common-subsequence',
  E'Given two strings `text1` and `text2`, return the length of their longest common subsequence.\n\nA subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.\n\nInput: Two lines, each containing a string.',
  '[{"input": "abcde\nace", "output": "3", "explanation": "The longest common subsequence is ace with length 3."}]',
  E'- 1 <= text1.length, text2.length <= 1000\n- Strings consist of lowercase English characters only.',
  'medium',
  'dp',
  '{"python": "text1 = input()\ntext2 = input()\n# Your solution here\n"}'
),
(
  'Number of Islands',
  'number-of-islands',
  E'Given an m x n 2D grid map of ''1''s (land) and ''0''s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nInput:\n- First line: m n (rows and columns)\n- Next m lines: n space-separated characters (0 or 1)',
  '[{"input": "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", "output": "1", "explanation": "All 1s are connected, forming one island."}]',
  E'- m == grid.length\n- n == grid[i].length\n- 1 <= m, n <= 300\n- grid[i][j] is ''0'' or ''1''.',
  'medium',
  'graphs',
  '{"python": "m, n = map(int, input().split())\ngrid = []\nfor _ in range(m):\n    grid.append(input().split())\n# Your solution here\n"}'
),
(
  'Merge Intervals',
  'merge-intervals',
  E'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and print the merged intervals.\n\nInput:\n- First line: n (number of intervals)\n- Next n lines: two space-separated integers (start end)\n\nOutput: Merged intervals, one per line as "start end".',
  '[{"input": "4\n1 3\n2 6\n8 10\n15 18", "output": "1 6\n8 10\n15 18", "explanation": "Intervals [1,3] and [2,6] overlap, so they are merged into [1,6]."}]',
  E'- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= start_i <= end_i <= 10^4',
  'medium',
  'arrays',
  '{"python": "n = int(input())\nintervals = []\nfor _ in range(n):\n    a, b = map(int, input().split())\n    intervals.append([a, b])\n# Your solution here\n"}'
),
(
  'Trapping Rain Water',
  'trapping-rain-water',
  E'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nInput:\n- First line: n\n- Second line: n space-separated integers\n\nOutput: Total trapped water.',
  '[{"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6", "explanation": "6 units of rain water are trapped."}]',
  E'- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5',
  'hard',
  'arrays',
  '{"python": "n = int(input())\nheight = list(map(int, input().split()))\n# Your solution here\n"}'
);

-- Test cases for Two Sum
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(1, E'4\n2 7 11 15\n9', '0 1', TRUE, 1),
(1, E'3\n3 2 4\n6', '1 2', TRUE, 2),
(1, E'2\n3 3\n6', '0 1', FALSE, 3),
(1, E'4\n1 5 8 3\n4', '0 3', FALSE, 4);

-- Test cases for Reverse String
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(2, 'hello', 'olleh', TRUE, 1),
(2, 'world', 'dlrow', TRUE, 2),
(2, 'a', 'a', FALSE, 3),
(2, 'racecar', 'racecar', FALSE, 4);

-- Test cases for FizzBuzz
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(3, '5', E'1\n2\nFizz\n4\nBuzz', TRUE, 1),
(3, '15', E'1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', TRUE, 2),
(3, '1', '1', FALSE, 3),
(3, '3', E'1\n2\nFizz', FALSE, 4);

-- Test cases for Palindrome Check
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(4, 'A man, a plan, a canal: Panama', 'true', TRUE, 1),
(4, 'race a car', 'false', TRUE, 2),
(4, ' ', 'true', FALSE, 3),
(4, 'ab', 'false', FALSE, 4);

-- Test cases for Maximum Subarray
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(5, E'9\n-2 1 -3 4 -1 2 1 -5 4', '6', TRUE, 1),
(5, E'1\n1', '1', TRUE, 2),
(5, E'5\n5 4 -1 7 8', '23', FALSE, 3),
(5, E'3\n-1 -2 -3', '-1', FALSE, 4);

-- Test cases for Valid Parentheses
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(6, '()', 'true', TRUE, 1),
(6, '()[]{}', 'true', TRUE, 2),
(6, '(]', 'false', FALSE, 3),
(6, '([)]', 'false', FALSE, 4),
(6, '{[]}', 'true', FALSE, 5);

-- Test cases for Merge Sorted Lists
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(7, E'3\n1 2 4\n3\n1 3 4', '1 1 2 3 4 4', TRUE, 1),
(7, E'0\n\n0\n', '', TRUE, 2),
(7, E'1\n5\n1\n3', '3 5', FALSE, 3);

-- Test cases for Longest Substring
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(8, 'abcabcbb', '3', TRUE, 1),
(8, 'bbbbb', '1', TRUE, 2),
(8, 'pwwkew', '3', FALSE, 3),
(8, '', '0', FALSE, 4);

-- Test cases for Binary Search
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(9, E'6\n-1 0 3 5 9 12\n9', '4', TRUE, 1),
(9, E'6\n-1 0 3 5 9 12\n2', '-1', TRUE, 2),
(9, E'1\n5\n5', '0', FALSE, 3);

-- Test cases for Climbing Stairs
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(10, '2', '2', TRUE, 1),
(10, '3', '3', TRUE, 2),
(10, '5', '8', FALSE, 3),
(10, '10', '89', FALSE, 4);

-- Test cases for Container With Most Water
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(11, E'9\n1 8 6 2 5 4 8 3 7', '49', TRUE, 1),
(11, E'2\n1 1', '1', TRUE, 2),
(11, E'4\n4 3 2 1', '4', FALSE, 3);

-- Test cases for Longest Common Subsequence
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(12, E'abcde\nace', '3', TRUE, 1),
(12, E'abc\nabc', '3', TRUE, 2),
(12, E'abc\ndef', '0', FALSE, 3);

-- Test cases for Number of Islands
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(13, E'4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', '1', TRUE, 1),
(13, E'4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', '3', TRUE, 2),
(13, E'1 1\n0', '0', FALSE, 3);

-- Test cases for Merge Intervals
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(14, E'4\n1 3\n2 6\n8 10\n15 18', E'1 6\n8 10\n15 18', TRUE, 1),
(14, E'2\n1 4\n4 5', '1 5', TRUE, 2),
(14, E'1\n1 1', '1 1', FALSE, 3);

-- Test cases for Trapping Rain Water
INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES
(15, E'12\n0 1 0 2 1 0 1 3 2 1 2 1', '6', TRUE, 1),
(15, E'5\n4 2 0 3 2', '5', TRUE, 2),
(15, E'3\n1 0 1', '1', FALSE, 3),
(15, E'1\n5', '0', FALSE, 4);
