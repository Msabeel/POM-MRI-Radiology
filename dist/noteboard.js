'use strict';

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _sequelize = require('sequelize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AWS = require('aws-sdk');
var BUCKET_NAME = 'ris-notes-image';
var BUCKET_URL = 'https://ris-notes-image.s3.amazonaws.com/';

module.exports.saveNoteboard = function (event, context, callback) {
    var data, findNote, result, current_date, fileName, imagePath, _result, current_date, _fileName, _imagePath, _test;

    return Promise.resolve().then(function () {
        context.callbackWaitsForEmptyEventLoop = false;
        data = {};

        try {
            data = JSON.parse(event.body);
        } catch (e) {
            data = event.body;
        }

        if (data && !data.userId) {
            data.userId = 101; // For testing only
        }
        _test = data && data.id;

        if (_test) {
            return Promise.resolve().then(function () {
                return _models2.default.tran_noteboard.findOne({
                    where: {
                        id: data.id
                    }
                });
            }).then(function (_resp) {
                findNote = _resp;
            });
        }
    }).then(function () {
        if (_test && findNote && findNote.id > 0) {
            return Promise.resolve().then(function () {
                return _models2.default.tran_noteboard.update({
                    note_title: data.title,
                    archive: data.archive,
                    note_description: data.description
                }, { where: { id: data.id } });
            }).then(function (_resp) {
                result = _resp;
            });
        }
    }).then(function () {
        if (_test && data.reminder) {
            return SaveReminderData(data, data.id);
        }
    }).then(function () {
        if (_test && data.image && data.image.indexOf('data:image') >= 0) {
            return Promise.resolve().then(function () {
                current_date = new Date().getTime();
                fileName = data.id + '_' + current_date + '.png';
                imagePath = BUCKET_URL + fileName;
                return uploadFile(fileName, data.image);
            }).then(function () {
                return SaveImageData(data, imagePath, data.id);
            });
        }
    }).then(function () {
        if (_test && data.checklist && data.checklist.length > 0) {
            return SaveCheckListData(data, data.id);
        }
    }).then(function () {
        if (_test && data.labels && data.labels.length > 0) {
            return SaveLabelsData(data, data.id);
        }
    }).then(function () {
        if (_test) {
            success(data, callback);
        } else {
            return Promise.resolve().then(function () {
                return _models2.default.tran_noteboard.create({
                    note_title: data.title,
                    note_description: data.description,
                    archive: data.archive,
                    created_by: data.userId
                });
            }).then(function (_resp) {
                _result = _resp;


                if (data.reminder) {
                    return SaveReminderData(data, _result.id);
                }
            }).then(function () {
                if (data.image) {
                    return Promise.resolve().then(function () {
                        current_date = new Date().getTime();
                        _fileName = _result.id + '_' + current_date + '.png';
                        _imagePath = BUCKET_URL + _fileName;
                        return uploadFile(_fileName, data.image);
                    }).then(function () {
                        return SaveImageData(data, _imagePath, _result.id);
                    });
                }
            }).then(function () {
                if (data.checklist && data.checklist.length > 0) {
                    return SaveCheckListData(data, _result.id);
                }
            }).then(function () {
                if (data.labels && data.labels.length > 0) {
                    return SaveLabelsData(data, _result.id);
                }
            }).then(function () {
                data.id = _result.id;
                success(data, callback);
            });
        }
    }).then(function () {});
};

module.exports.getNoteboard = function (event, context, callback) {
    var result;
    return Promise.resolve().then(function () {
        context.callbackWaitsForEmptyEventLoop = false;
        return Promise.resolve().then(function () {
            return getNotes();
        }).then(function (_resp) {
            result = _resp;

            success(result, callback);
        }).catch(function (err) {
            error(err.message, callback);
        });
    }).then(function () {});
};

function getNotes() {
    var result, finalResult, i, checkLists, labels, j, check, checklist, _j, lbl, obj;

    return Promise.resolve().then(function () {
        return _models2.default.tran_noteboard.findAll({
            where: {
                created_by: 101,
                delete: false
            },
            include: [{
                model: _models2.default.tran_reminder,
                where: { delete: false },
                required: false
            }, {
                model: _models2.default.tran_image,
                where: { delete: false },
                required: false
            }, {
                model: _models2.default.tran_checklist,
                where: { delete: false },
                required: false
            }, {
                model: _models2.default.tran_labels,
                where: { delete: false },
                required: false
            }]
        });
    }).then(function (_resp) {
        result = _resp;
        finalResult = [];

        for (i = 0; i < result.length; i++) {
            checkLists = [];
            labels = [];

            if (result[i].tran_checklists) {
                for (j = 0; j < result[i].tran_checklists.length; j++) {
                    check = result[i].tran_checklists[j];
                    checklist = {
                        id: check.id,
                        text: check.checklist_description,
                        checked: check.checked
                    };

                    checkLists.push(checklist);
                }
            }
            if (result[i].tran_labels) {
                for (_j = 0; _j < result[i].tran_labels.length; _j++) {
                    lbl = result[i].tran_labels[_j];

                    labels.push(lbl.label_id);
                }
            }
            obj = {
                id: result[i].id,
                title: result[i].note_title,
                description: result[i].note_description,
                checklist: checkLists,
                archive: false,
                image: result[i].tran_image && result[i].tran_image.image_path,
                reminder: result[i].tran_reminder && result[i].tran_reminder.reminder_date,
                labels: labels
            };


            finalResult.push(obj);
        }
        return finalResult;
    });
}
module.exports.removeNote = function (event, context, callback) {
    var data, result;
    return Promise.resolve().then(function () {
        context.callbackWaitsForEmptyEventLoop = false;
        data = {};

        try {
            data = JSON.parse(event.body);
        } catch (e) {
            data = event.body;
        }

        return Promise.resolve().then(function () {
            return _models2.default.tran_noteboard.update({
                delete: true
            }, { where: { id: data.noteId } });
        }).then(function () {
            return getNotes();
        }).then(function (_resp) {
            result = _resp;

            success(result, callback);
        }).catch(function (err) {
            error(err.message, callback);
        });
    }).then(function () {});
};

function SaveReminderData(data, noteboard_id) {
    var findNoteReminder, res, _res;

    return Promise.resolve().then(function () {
        return _models2.default.tran_reminder.findOne({
            where: {
                noteboard_id: data.id
            }
        });
    }).then(function (_resp) {
        findNoteReminder = _resp;

        if (findNoteReminder) {
            return Promise.resolve().then(function () {
                return _models2.default.tran_reminder.update({
                    reminder_date: data.reminder
                }, { where: { id: findNoteReminder.id } });
            }).then(function (_resp) {
                res = _resp;

                return res;
            });
        } else {
            return Promise.resolve().then(function () {
                return _models2.default.tran_reminder.create({
                    noteboard_id: noteboard_id,
                    reminder_date: data.reminder,
                    created_by: data.userId
                });
            }).then(function (_resp) {
                _res = _resp;

                return _res;
            });
        }
    }).then(function () {});
}

function SaveImageData(data, imagePath, noteboard_id) {
    var findNoteImage, res, _res2;

    return Promise.resolve().then(function () {
        return _models2.default.tran_image.findOne({
            where: {
                noteboard_id: data.id
            }
        });
    }).then(function (_resp) {
        findNoteImage = _resp;

        if (findNoteImage) {
            return Promise.resolve().then(function () {
                return _models2.default.tran_image.update({
                    image_path: imagePath
                }, { where: { id: findNoteImage.id } });
            }).then(function (_resp) {
                res = _resp;

                return res;
            });
        } else {
            return Promise.resolve().then(function () {
                return _models2.default.tran_image.create({
                    noteboard_id: noteboard_id,
                    image_path: imagePath,
                    created_by: data.userId
                });
            }).then(function (_resp) {
                _res2 = _resp;

                return _res2;
            });
        }
    }).then(function () {});
}

function SaveCheckListData(data, noteboard_id) {
    function _recursive() {
        var _test2;

        return Promise.resolve().then(function () {
            _test2 = j < findNoteCheckList.length;

            if (_test2 && sourceCheckListObj.id == findNoteCheckList[j].id) {
                return Promise.resolve().then(function () {
                    return Promise.resolve().then(function () {
                        return _models2.default.tran_checklist.update({
                            checklist_description: sourceCheckListObj.text,
                            checked: sourceCheckListObj.checked === undefined ? false : sourceCheckListObj.checked
                        }, { where: { id: sourceCheckListObj.id } });
                    }).catch(function (err) {
                        if (err.message == 'Query was empty') {
                            console.log('There is no changes in the update, lets continue the progress...');
                        }
                    });
                }).then(function () {
                    isFound = true;
                });
            }
        }).then(function () {
            if (_test2) {
                j = j + 1;
                return _recursive();
            }
        });
    }

    function _recursive2() {
        var _test3;

        return Promise.resolve().then(function () {
            _test3 = _i < findNoteCheckList.length;

            if (_test3) {
                _isFound = false;

                for (_j2 = 0; _j2 < data.checklist.length; _j2 = _j2 + 1) {
                    if (data.checklist[_j2].id == findNoteCheckList[_i].id) {
                        _isFound = true;
                    }
                }
            }

            if (_test3 && !_isFound) {
                return _models2.default.tran_checklist.update({
                    delete: true
                }, { where: { id: findNoteCheckList[_i].id } });
            }
        }).then(function () {
            if (_test3) {
                _i = _i + 1;
                return _recursive2();
            }
        });
    }

    var findNoteCheckList, dataArray, i, sourceCheckListObj, isFound, j, checklistObj, _i, _isFound, _j2, res, _dataArray, _i2, _checklistObj, _res3;

    return Promise.resolve().then(function () {
        return _models2.default.tran_checklist.findAll({
            where: {
                noteboard_id: noteboard_id,
                delete: false
            }
        }, { raw: true });
    }).then(function (_resp) {
        findNoteCheckList = _resp;


        if (findNoteCheckList) {
            return function () {
                function _recursive3() {
                    var _test4;

                    return Promise.resolve().then(function () {
                        _test4 = i < data.checklist.length;

                        if (_test4) {
                            sourceCheckListObj = data.checklist[i];
                            isFound = false;
                            j = 0;
                            return _recursive();
                        }
                    }).then(function () {
                        if (_test4 && !isFound) {
                            checklistObj = {
                                noteboard_id: noteboard_id,
                                checklist_description: data.checklist[i].text,
                                checked: data.checklist[i].checked || false,
                                created_by: data.userId
                            };

                            dataArray.push(checklistObj);
                        }

                        if (_test4) {
                            i = i + 1;
                            return _recursive3();
                        }
                    });
                }

                return Promise.resolve().then(function () {
                    dataArray = [];
                    // To insert new checklist and update existing one

                    i = 0;
                    return _recursive3();
                }).then(function () {
                    // To delete existing one
                    _i = 0;
                    return _recursive2();
                }).then(function () {
                    return _models2.default.tran_checklist.bulkCreate(dataArray);
                }).then(function (_resp) {
                    res = _resp;

                    return res;
                });
            }();
        } else {
            return Promise.resolve().then(function () {
                _dataArray = [];
                for (_i2 = 0; _i2 < data.checklist.length; _i2 = _i2 + 1) {
                    _checklistObj = {
                        noteboard_id: noteboard_id,
                        checklist_description: data.checklist[_i2].text,
                        checked: data.checklist[_i2].checked,
                        created_by: data.userId
                    };

                    _dataArray.push(_checklistObj);
                }
                return _models2.default.tran_checklist.bulkCreate(_dataArray);
            }).then(function (_resp) {
                _res3 = _resp;

                return _res3;
            });
        }
    }).then(function () {});
}

function SaveLabelsData(data, noteboard_id) {
    function _recursive4() {
        var _test5;

        return Promise.resolve().then(function () {
            _test5 = _i3 < findNoteLabels.length;

            if (_test5) {
                _isFound2 = false;

                for (_j3 = 0; _j3 < data.labels.length; _j3 = _j3 + 1) {
                    if (data.labels[_j3] == findNoteLabels[_i3].label_id) {
                        _isFound2 = true;
                    }
                }
            }

            if (_test5 && !_isFound2) {
                return _models2.default.tran_labels.update({
                    delete: true
                }, { where: { id: findNoteLabels[_i3].id } });
            }
        }).then(function () {
            if (_test5) {
                _i3 = _i3 + 1;
                return _recursive4();
            }
        });
    }

    var findNoteLabels, dataArray, i, isFound, j, Obj, _i3, _isFound2, _j3, res, _dataArray2, _i4, checklistObj, _res4;

    return Promise.resolve().then(function () {
        return _models2.default.tran_labels.findAll({
            where: {
                noteboard_id: noteboard_id,
                delete: false
            }
        }, { raw: true });
    }).then(function (_resp) {
        findNoteLabels = _resp;


        if (findNoteLabels) {
            return Promise.resolve().then(function () {
                dataArray = [];
                // To insert new lables

                for (i = 0; i < data.labels.length; i = i + 1) {
                    isFound = false;

                    for (j = 0; j < findNoteLabels.length; j = j + 1) {
                        if (data.labels[i] == findNoteLabels[j].label_id) {
                            isFound = true;
                        }
                    }
                    if (!isFound) {
                        Obj = {
                            noteboard_id: noteboard_id,
                            label_id: data.labels[i],
                            created_by: data.userId
                        };

                        dataArray.push(Obj);
                    }
                }
                // To delete existing one
                _i3 = 0;
                return _recursive4();
            }).then(function () {
                return _models2.default.tran_labels.bulkCreate(dataArray);
            }).then(function (_resp) {
                res = _resp;

                return res;
            });
        } else {
            return Promise.resolve().then(function () {
                _dataArray2 = [];
                for (_i4 = 0; _i4 < data.checklist.length; _i4 = _i4 + 1) {
                    checklistObj = {
                        noteboard_id: noteboard_id,
                        checklist_description: data.checklist[_i4].text,
                        checked: data.checklist[_i4].checked,
                        created_by: data.userId
                    };

                    _dataArray2.push(checklistObj);
                }
                return _models2.default.tran_checklist.bulkCreate(_dataArray2);
            }).then(function (_resp) {
                _res4 = _resp;

                return _res4;
            });
        }
    }).then(function () {});
}

function InsertLabelsData(data, noteboard_id) {
    var dataArray, i, Obj, res;
    return Promise.resolve().then(function () {
        dataArray = [];
        for (i = 0; i < data.labels.length; i = i + 1) {
            Obj = {
                noteboard_id: noteboard_id,
                label_id: data.labels[i],
                created_by: data.userId
            };

            dataArray.push(Obj);
        }
        return _models2.default.tran_labels.bulkCreate(dataArray);
    }).then(function (_resp) {
        res = _resp;

        return res;
    });
}

function success(data, callback) {
    var response = {
        statusCode: 201,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({ data: data }),
        data: data,
        isBase64Encoded: false
    };
    callback(null, response);
}
function error(message, callback) {
    var response = {
        statusCode: 500,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({ error: message }),
        isBase64Encoded: false
    };
    callback(null, response);
}

var uploadFile = function uploadFile(fileName, fileContent) {
    var s3bucket, base64Data, params, response;
    return Promise.resolve().then(function () {
        return Promise.resolve().then(function () {
            s3bucket = new AWS.S3();
            base64Data = fileContent.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            // Setting up S3 upload parameters

            params = {
                Bucket: BUCKET_NAME,
                Key: fileName, // File name you want to save as in S3
                Body: Buffer.from(base64Data, 'base64')
            };

            // Uploading files to the bucket

            return s3bucket.upload(params).promise();
        }).then(function (_resp) {
            response = _resp;
            return response.Location;
        }).catch(function (ex) {
            console.log('ex', ex);
        });
    }).then(function () {});
};