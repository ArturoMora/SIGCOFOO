namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoClaveEmpresaId : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.cat_ClavesEmpresas",
                c => new
                    {
                        ClaveEmpresasId = c.Int(nullable: false, identity: true),
                        ClaveEmpresa = c.String(maxLength: 100),
                        Autor = c.String(nullable: false, maxLength: 250),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ClaveEmpresasId);
            
            AddColumn("CR.cat_Empresas", "ClaveEmpresa", c => c.String(maxLength: 100));
            AddColumn("CR.UnidadOrganizacionalEmpresas", "ClaveEmpresa", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            DropColumn("CR.UnidadOrganizacionalEmpresas", "ClaveEmpresa");
            DropColumn("CR.cat_Empresas", "ClaveEmpresa");
            DropTable("CR.cat_ClavesEmpresas");
        }
    }
}
