//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Musaranha.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Pessoa
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Pessoa()
        {
            this.Telefones = new HashSet<Telefone>();
        }
    
        public int CodPessoa { get; set; }
        public int CodEndereco { get; set; }
        public string Tipo { get; set; }
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string CNPJ { get; set; }
        public string Email { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        public virtual Endereco Endereco { get; set; }
        public virtual Fornecedor Fornecedor { get; set; }
        public virtual Funcionario Funcionario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Telefone> Telefones { get; set; }
    }
}