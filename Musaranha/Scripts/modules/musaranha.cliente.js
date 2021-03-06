﻿Musaranha.Cliente = Musaranha.Cliente || (function () {
    function iniciar() {
        $('select').material_select();

        $('button.incluir').off('click').click(function () {
            abrirModalInclusao();
        });

        $('button.editar').off('click').click(function () {
            abrirModalEdicao(this);
        });

        $('button.excluir').off('click').click(function () {
            var $tr = $(this).parents('tr');
            var codPessoa = $tr.data('cliente');
            var nome = $tr.find('td').eq(0).text();
            var telefone = $tr.find('td').eq(1).text();
            abrirModalExclusao(codPessoa, nome, telefone);
        });

        $('table tr').off('hover').hover(function () {
            var $tr = $(this);
            var $tfoot = $tr.parents('table').find('tfoot');
            $tfoot.find('[data-campo=endereco]').text($tr.data('endereco'));
            $tfoot.find('[data-campo=cpfcnpj]').text($tr.data('cnpj') || $tr.data('cpf'));
            $tfoot.find('[data-campo=email]').text($tr.data('email'));
        });

        $('input#txtTelefone').off('change').change(function () {
            novoTelefone($(this));
        });
    }

    function novoTelefone($input) {
        var $section = $input.closest('div.telefones');
        var $lastInput = $section.find('input[id^=txtTelefone]').last();
        if (checarTelefone($lastInput)) {
            var $cloneInput = $lastInput.clone();
            var n = parseInt($cloneInput.attr('name').replace(/\D/g, ''));
            var name = $cloneInput.attr('name').replace(/\d/g, '') + (++n);
            $cloneInput.val('');
            $cloneInput.attr('name', name);
            $section.append($cloneInput);
            iniciar();
            Musaranha.reativarMask();
        }
        else if ($input.val().trim().length == 0) {
            if ($section.find('input[id^=txtTelefone]').length > 1)
                $lastInput.remove();
        }
    }

    function checarTelefone($input) {
        var telefone = $input.val().replace(/\D/g, '');
        return (telefone.length == 11 || telefone.length == 10);
    }

    function abrirModalInclusao() {
        var $modal = $('.acao.modal');
        $('select').material_select();

        $modal.find('.header').text('Incluir Cliente');
        while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
            $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
        }
        $modal.find('.primary').text('Incluir').off().click(function () {
            incluir();
        });

        $modal.openModal();
    }

    function abrirModalEdicao(button) {
        var $modal = $('.acao.modal');
        var $tds = $(button).parents('tr').find('td');
        var codPessoa = $(button).parents('tr').data('cliente');

        $modal.find('.header').text('Editar Cliente');
        while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
            $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
        }
        $.ajax({
            url: '/cliente/json/' + codPessoa,
            type: 'POST',
            success: function (cliente) {
                $modal.find('#txtNome').val(cliente.Nome);
                for (var i = 0, length = cliente.Telefones.length; i < length; i++) {
                    var $input = $modal.find('input[id^=txtTelefone]').last();
                    $input.val(cliente.Telefones[i]);
                    novoTelefone($input);
                }
                $modal.find('#txtLogradouro').val(cliente.Logradouro);
                $modal.find('#txtNumero').val(cliente.Numero);
                $modal.find('#txtComplemento').val(cliente.Complemento);
                $modal.find('#txtCEP').val(cliente.CEP);
                $modal.find('#txtBairro').val(cliente.Bairro);
                $modal.find('#txtCidade').val(cliente.Cidade);
                $modal.find('#txtEstado').val(cliente.Estado);
                $modal.find('#txtTipo').val(cliente.Tipo).material_select();
                $modal.find('#txtCPFOuCNPJ').val(cliente.CPF || cliente.CNPJ);
                $modal.find('#txtEmail').val(cliente.Email);

                $modal.find('.primary').text('Editar').off().click(function () {
                    editar(codPessoa);
                });

                Musaranha.reativarMask();
                iniciar();

                $modal.openModal();
            }
        });
    }

    function abrirModalExclusao(codPessoa, nome, telefone) {
        var $modal = $('.excluir.modal');
        $modal.find('.info').html('');
        $modal.find('.info').append('<p><b>Nome: </b>' + nome + '</p>');
        $modal.find('.info').append('<p><b>Telefone(s): </b>' + telefone + '</p>');

        $modal.find('.primary').off().click(function () {
            excluir(codPessoa);
        });

        $modal.openModal();
    }

    function incluir() {
        if (validar()) {
            var form = $('form.acao.modal').serializeArray();
            $('form.acao.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
            $.ajax({
                type: 'POST',
                url: '/cliente/incluir',
                data: form,
                success: function (clientes) {
                    var $tbody = $('.table.clientes tbody');
                    $tbody.html(clientes);
                    Materialize.toast('Cliente incluído com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na inclusão do Cliente', 4000);
                },
                complete: function () {
                    $('form.acao.modal .modal-footer .progress').remove();
                    while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
                        $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
                    }
                    $('form.acao.modal').get(0).reset();
                    $('form.acao.modal').closeModal();
                }
            })
        }
        else return false;
    }

    function editar(codPessoa) {
        if (validar()) {
            var form = $('form.acao.modal').serializeArray();
            $('form.acao.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
            $.ajax({
                type: 'POST',
                data: form,
                url: '/cliente/editar/' + codPessoa,
                success: function (clientes) {
                    var $tbody = $('table tbody');
                    $tbody.html(clientes);
                    Materialize.toast('Cliente editado com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na edição do Cliente', 4000);
                },
                complete: function () {
                    $('form.acao.modal .modal-footer .progress').remove();
                    while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
                        $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
                    }
                    $('form.acao.modal').get(0).reset();
                    $('form.acao.modal').closeModal();
                }
            })
        }
        else return false;
    }

    function excluir(codPessoa) {
        $('form.excluir.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
        $.ajax({
            type: 'POST',
            url: '/cliente/excluir/' + codPessoa,
            success: function (clientes) {
                var $tbody = $('table tbody');
                $tbody.html(clientes);
                Materialize.toast('Cliente excluído com sucesso', 4000);
                iniciar();
            },
            error: function () {
                Materialize.toast('Ocorreu um erro na exclusão do Cliente', 4000);
            },
            complete: function () {
                $('form.excluir.modal .modal-footer .progress').remove();
                $('form.excluir.modal').find('.info').html('');
                $('form.excluir.modal').closeModal();
            }
        })
    }

    function validar() {
        var valido = true;
        var $form = $('form');

        if (!$('#txtNome').val()) {
            $('#txtNome').addClass("invalid");
            valido = false;
        }
        if (!$('#txtTelefone').val()) {
            $('#txtTelefone').addClass("invalid");
            valido = false;
        }
        if ($('#txtTelefone').val()) {
            var telefone = $('#txtTelefone').val().replace(/\D/g, '');
            if (telefone.length != 10 && telefone.length != 11) {
                $('#txtTelefone').addClass("invalid");
                valido = false;
            }
        }
        if ($('#txtCPFOuCNPJ').val()) {
            var CPFOuCNPJ = $('#txtCPFOuCNPJ').val().replace(/\D/g, '');
            if (CPFOuCNPJ.length == 11) {
                if (!Musaranha.validarCPF(CPFOuCNPJ)) {
                    $('#txtCPFOuCNPJ').addClass("invalid");
                    valido = false;
                }
            }
            else if (CPFOuCNPJ.length == 14) {
                if (!Musaranha.validarCNPJ(CPFOuCNPJ)) {
                    $('#txtCPFOuCNPJ').addClass("invalid");
                    valido = false;
                }
            }
            else {
                $('#txtCPFOuCNPJ').addClass("invalid");
                valido = false;
            }
        }

        return valido;
    }

    return {
        iniciar: iniciar
    }
})();