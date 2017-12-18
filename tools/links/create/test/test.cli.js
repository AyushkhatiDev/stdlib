'use strict';

// MODULES //

var resolve = require( 'path' ).resolve;
var exec = require( 'child_process' ).exec;
var tape = require( 'tape' );
var IS_BROWSER = require( '@stdlib/assert/is-browser' );
var IS_WINDOWS = require( '@stdlib/assert/is-windows' );
var readFileSync = require( '@stdlib/fs/read-file' ).sync;


// VARIABLES //

var fpath = resolve( __dirname, '..', 'bin', 'cli' );
var opts = {
	'skip': IS_BROWSER || IS_WINDOWS
};


// FIXTURES //

var PKG_VERSION = require( './../package.json' ).version;


// TESTS //

tape( 'command-line interface', function test( t ) {
	t.ok( true, __filename );
	t.end();
});

tape( 'when invoked with a `--help` flag, the command-line interface prints the help text to `stderr`', opts, function test( t ) {
	var expected;
	var cmd;

	expected = readFileSync( resolve( __dirname, '..', 'docs', 'usage.txt' ), {
		'encoding': 'utf8'
	});
	cmd = [
		process.execPath,
		fpath,
		'--help'
	];

	exec( cmd.join( ' ' ), done );

	function done( error, stdout, stderr ) {
		if ( error ) {
			t.fail( error.message );
		} else {
			t.strictEqual( stdout.toString(), '', 'does not print to `stdout`' );
			t.strictEqual( stderr.toString(), expected+'\n', 'expected value' );
		}
		t.end();
	}
});

tape( 'when invoked with a `-h` flag, the command-line interface prints the help text to `stderr`', opts, function test( t ) {
	var expected;
	var cmd;

	expected = readFileSync( resolve( __dirname, '..', 'docs', 'usage.txt' ), {
		'encoding': 'utf8'
	});
	cmd = [
		process.execPath,
		fpath,
		'-h'
	];

	exec( cmd.join( ' ' ), done );

	function done( error, stdout, stderr ) {
		if ( error ) {
			t.fail( error.message );
		} else {
			t.strictEqual( stdout.toString(), '', 'does not print to `stdout`' );
			t.strictEqual( stderr.toString(), expected+'\n', 'expected value' );
		}
		t.end();
	}
});

tape( 'when invoked with a `--version` flag, the command-line interface prints the version to `stderr`', opts, function test( t ) {
	var cmd = [
		process.execPath,
		fpath,
		'--version'
	];

	exec( cmd.join( ' ' ), done );

	function done( error, stdout, stderr ) {
		if ( error ) {
			t.fail( error.message );
		} else {
			t.strictEqual( stdout.toString(), '', 'does not print to `stdout`' );
			t.strictEqual( stderr.toString(), PKG_VERSION+'\n', 'expected value' );
		}
		t.end();
	}
});

tape( 'when invoked with a `-V` flag, the command-line interface prints the version to `stderr`', opts, function test( t ) {
	var cmd = [
		process.execPath,
		fpath,
		'-V'
	];

	exec( cmd.join( ' ' ), done );

	function done( error, stdout, stderr ) {
		if ( error ) {
			t.fail( error.message );
		} else {
			t.strictEqual( stdout.toString(), '', 'does not print to `stdout`' );
			t.strictEqual( stderr.toString(), PKG_VERSION+'\n', 'expected value' );
		}
		t.end();
	}
});

tape( 'the command-line interface tries to insert an entry for the provided URI into the link database', opts, function test( t ) {
	var expected;
	var cmd;

	cmd = [
		process.execPath,
		'-e',
		'"process.stdin.isTTY = true; process.argv[ 2 ] = \'https://stdlib.io/\';  process.argv[ 3 ] = \'--id\'; process.argv[ 4 ] = \'stdlib\'; process.argv[ 5 ] = \'--desc\'; process.argv[ 6 ] = \'A standard library for JavaScript and Node.js\';require( \''+fpath+'\' );"'
	];

	exec( cmd.join( ' ' ), done );

	expected = 'duplicate entry. Database already contains an entry for the provided URI: https://stdlib.io/.\n';

	function done( error, stdout, stderr ) {
		t.strictEqual( error instanceof Error, true, 'returns an error' );
		t.strictEqual( stdout.toString(), '', 'does not print to `stdout`' );
		t.strictEqual( stderr.toString(), expected, 'prints error message' );
		t.end();
	}
});

tape( 'the command-line interface tries to insert an entry for the provided URI into the link database (interactive prompt)', opts, function test( t ) {
	var expected;
	var child;
	var cmd;

	cmd = [
		process.execPath,
		'-e',
		'"process.stdin.isTTY = true; require( \''+fpath+'\' );"'
	];

	child = exec( cmd.join( ' ' ), done );
	child.stdin.write( 'https://stdlib.io/\n' );
	child.stdin.write( 'stdlib\n' );
	child.stdin.write( 'A standard library for JavaScript and Node.js\n' );
	child.stdin.end();

	expected = 'duplicate entry. Database already contains an entry for the provided URI: https://stdlib.io/.\n';

	function done( error, stdout, stderr ) {
		stdout = stdout.toString();
		t.strictEqual( stdout.length > 10, true, 'prints prompts' );
		t.strictEqual( error instanceof Error, true, 'returns an error' );
		t.strictEqual( stderr.toString(), expected, 'prints error message' );
		t.end();
	}
});
