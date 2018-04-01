var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var config = require('../../env.json');

exports.stt_token = function(req, res) {
    var sttConfig = extend(config.speech_to_text, vcapServices.getCredentials('speech_to_text'));

    var sttAuthService = watson.authorization(sttConfig);

    sttAuthService.getToken({
        url: sttConfig.url
    }, function(err, token) {
        if (err) {
            console.log('Error retrieving speech to text token: ', err);
            res.status(500).send('Error retrieving speech to text token');
            return;
        }
        res.send(token);
    });
}

exports.tts_synthesize = function(req, res) {
  console.log("tts_synthesize entered");

    var ttsConfig = watson.text_to_speech(config.text_to_speech);

    var transcript = ttsConfig.synthesize(req.query);
    transcript.on('response', function(response) {
      if (req.query.download) {
        response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
    });

    transcript.on('error', function(error) { console.log("error encountered: "+error); next(error); });
    transcript.pipe(res);
}
