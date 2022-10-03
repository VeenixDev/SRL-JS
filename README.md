# SRL - Structured RegExp Language

This is a simple language which compiles into a "Regular Expression". The language is inspired by the [post](https://www.reddit.com/r/Lightbulb/comments/mnndfc/structured_regex_language/) of [u/johnngnky](https://www.reddit.com/user/johnngnky/) on Reddit.

I don't follow the post from him but the way I created the syntax is inspired by his post and I got the idea to make this from him.

The project is in an very early state and is not mend to be used in an actual application.

- [SRL - Structured RegExp Language](#srl---structured-regexp-language)
- [Language](#language)
  - [Data Types](#data-types)
  - [Constants](#constants)
  - [Anchors](#anchors)
  - [Groups](#groups)
  - [Quantifiers](#quantifiers)
  - [Instructions](#instructions)
  - [Flags](#flags)

# Language

## Data Types

SRL has a few data types you should know before starting to work with SRL.

| Name     | Usage  | Description                        |
| -------- | ------ | ---------------------------------- |
| Number   | $5     | A number is idecated by a $        |
| String   | "Foo"  | A string is contained inside two " |
| Constant | !digit | A constant is indecated by a !     |

## Constants

Constants are pre defined patterns that can be reused.

| Name                           | Usage         | RegExp | Description                               |
| ------------------------------ | ------------- | ------ | ----------------------------------------- |
| Any char                       | !any          | .      | Any single character                      |
| Any whitespace                 | !whitespace   | \s     | Any whitespace character                  |
| Any non-whitespace             | !!whitespace  | \S     | Any non-whitespace character              |
| Any digit                      | !digit        | \d     | Any digit                                 |
| Any non-digit                  | !!digit       | \D     | Any non-digit                             |
| Any word character             | !word         | \w     | Any word character                        |
| Any non-word character         | !!word        | \W     | Any non-word character                    |
| Any unicode sequence           | !unicode      | \X     | Any Unicode sequence, linebreaks included |
| Match data unit                | !dataunit     | \C     | Match one data unit                       |
| Unicode newline                | !uninl        | \R     | Unicode newlines                          |
| Anything but newline           | !!newline     | \N     | Match anything but a newline              |
| Vertical whitespace            | !vwhitespace  | \v     | Vertical whitespace character             |
| Negative vertical whitespace   | !!vwhitespace | \V     | Negation of \v                            |
| Horizontal whitespace          | !hwhitespace  | \h     | Horizontal whitespace character           |
| Negative horizontal whitespace | !!hwhitespace | \H     | Negation of \h                            |
| Reset Match                    | !reset        | \K     | Reset match                               |
| Control character Y            | !ycontrol     | \cY    | Control Character Y                       |
| Backspace                      | !backspace    | [\b]   | Backspace character                       |
| Newline                        | !newline      | \n     | Newline                                   |
| Carriage return                | !carriage     | \r     | Carriage return                           |
| Tab                            | !tab          | \t     | Tab                                       |
| Null character                 | !null         | \0     | Null charachter                           |

## Anchors

Anchors allows you to jump to certain points.

| Name               | Usage              | RegExp | Descriptions          |
| ------------------ | ------------------ | ------ | --------------------- |
| Start match        | STAT MATCH         | \G     | Start of match        |
| Start input*       | START INPUT        | ^ / \A | Start of input        |
| End input*         | END INPUT          | $ / \Z | End of input          |
| Absolute end input | ABSOLUTE END INPUT | \z     | Absolute end of input |
| word boundary      | WORD BOUNDARY      | \b     | A word boundary       |
| boundary           | BOUNDARY           | \B     | Non-word boundary     |

\* ^ and $ match the start and end of a line if Multiline is enabled

## Groups

Groups are much like normal groups in regex and can be used as such.  
There are some different ways how we can use groups.

| Name                | Usage                                                                   | RegExp                      | Description                                   |
| ------------------- | ----------------------------------------------------------------------- | --------------------------- | --------------------------------------------- |
| Capture enclosed    | [...]                                                                   | (...)                       | Capture everything enclosed                   |
| Atomic capture      | ATMOIC [...]                                                            | (?>...)                     | Atmoic group (non-capturing)                  |
| Named group         | NAME "Foo" FOR [...]                                                    | (?\<Foo>)                   | Named capturing group                         |
| Define group \*     | DEFINE "Foo" FOR [...]                                                  |                             | Defines a group for later use                 |
| Positive lookahead  | POSITIVE LOOKAHEAD [...]                                                | (?=...)                     | Positive lookahead                            |
| Negative lookahead  | NEGATIVE LOOKAHEAD [...]                                                | (?!...)                     | Negative lookahead                            |
| Positive lookbehind | POSITIVE LOOKBEHIND [...]                                               | (?<=...)                    | Positive lookbehind                           |
| Negative lookbehind | NEGATIVE LOOKBEHIND [...]                                               | (?<!...)                    | Negative lookbehind                           |
| If branching        | IF ([LITERAL ("foo")]) THEN [LITERAL ("Bar")] ELSE [LITERAL ("barFoo")] | (((?=foo)fooBar)\|(barFoo)) | Allows to go through different regex branches |

\* Is not supported by the Emacs RegExp Engine, but its implemented via SRL

## Quantifiers

Quantifiers are used to define how often the last element should be repeated.

| Name             | Usage                         | RegExp | Description           |
| ---------------- | ----------------------------- | ------ | --------------------- |
| Optional         | LITERAL ("a") OPTIONAL        | a?     | 0 or 1 of a           |
| Zero or More*    | LITERAL ("a") MANY            | a*     | 0 or more of a        |
| One or More      | LITERAL ("a") MANY1           | a+     | 1 or more of a        |
| Exact            | LITERAL ("a") EXACT ($3)      | a{3}   | Exactly 3 of a        |
| More than        | LITERAL ("a") MORE ($3)       | a{3,}  | 3 or more of a        |
| Less than \*\*\* | LITERAL ("a") LESS ($3)       | a{0,3} | 3 or less of a        |
| Between          | LITERAL ("a") BETWEEN ($3 $6) | a{3,6} | Between 3 and 6 of a  |
| Greedy**         | LITERAL ("a") GREEDY          | a*     | Greedy quantifier     |
| Lazy             | LITERAL ("a") LAZY            | a*?    | Lazy quantifier       |
| Possessive       | LITERAL ("a") POSSESSIVE      | a*+    | Possessive quantifier |

\* Is replaceable with GREEDY  
\*\* Is replaceable with MANY  
\*\*\* Is not supported by the Emacs RegExp Engine, but its implemented via SRL

## Instructions

Instructions are used to define your patterns.

| Name          | Usage                          | RegExp | Description                |
| ------------- | ------------------------------ | ------ | -------------------------- |
| From          | FROM ("123")                   | [123]  | Single char of             |
| Except        | EXCEPT ("123")                 | [^123] | Any other char than        |
| Literal       | LITERAL ("a")                  | a      | Whole string matches       |
| Or            | LITERAL ("a") OR LTIERAL ("b") | a\|b   | a or b                     |
| Subroutine \* | SUBROUTINE("test")             |        | Matches a predefined group |

\* Custom implementation, this feature is not a part of the default regex engine for ecmascript

## Flags

Flags are used to set the modes in the RegExp parser

| Name             | Usage            | Description                                                       |
| ---------------- | ---------------- | ----------------------------------------------------------------- |
| Global           | GLOBAL           | Does not stop after first match                                   |
| Multiline        | MULTILINE        | ^ and $ match the start and end of the line                       |
| Case insensitive | CASE INSENSITIVE | Matches capital letters and non-captial letters as the same       |
| Single line      | SINGLE LINE      | Reads whole input as one line                                     |
| Unicode          | UNICODE          | Strings will be treated as UTF-16                                 |
| STICKY           | STICKY           | Forces pattern to anchor at start of the search or the last match |

\* Also called "Ignore Whitespace"
