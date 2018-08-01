namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Marco12SepPropuestaEmpre : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Iniciativas", "EmpresaId", c => c.Int());
            AddColumn("GEN.Iniciativas", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            AddColumn("GEN.Iniciativas", "ContactoId", c => c.Int());
            AddColumn("GEN.Propuestas", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            AddColumn("GEN.Propuestas", "ContactoId", c => c.Int());
            CreateIndex("GEN.Iniciativas", "EmpresaId");
            CreateIndex("GEN.Iniciativas", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Iniciativas", "ContactoId");
            CreateIndex("GEN.Propuestas", "ClaveUnidadEmpresa");
            CreateIndex("GEN.Propuestas", "ContactoId");
            AddForeignKey("GEN.Iniciativas", "ContactoId", "CR.cat_Contactos", "ContactoId");
            AddForeignKey("GEN.Iniciativas", "EmpresaId", "CR.cat_Empresas", "EmpresaId");
            AddForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
            AddForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos", "ContactoId");
            AddForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos");
            DropForeignKey("GEN.Iniciativas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            DropForeignKey("GEN.Iniciativas", "EmpresaId", "CR.cat_Empresas");
            DropForeignKey("GEN.Iniciativas", "ContactoId", "CR.cat_Contactos");
            DropIndex("GEN.Propuestas", new[] { "ContactoId" });
            DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Iniciativas", new[] { "ContactoId" });
            DropIndex("GEN.Iniciativas", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Iniciativas", new[] { "EmpresaId" });
            DropColumn("GEN.Propuestas", "ContactoId");
            DropColumn("GEN.Propuestas", "ClaveUnidadEmpresa");
            DropColumn("GEN.Iniciativas", "ContactoId");
            DropColumn("GEN.Iniciativas", "ClaveUnidadEmpresa");
            DropColumn("GEN.Iniciativas", "EmpresaId");
        }
    }
}
