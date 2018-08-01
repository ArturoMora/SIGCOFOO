namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevosCamposEmpresaYUnidadMarco : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Empresas", "ClaveEmpresa", c => c.String(maxLength: 100));
            //AddColumn("CR.UnidadOrganizacionalEmpresas", "ClaveEmpresa", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            //DropColumn("CR.UnidadOrganizacionalEmpresas", "ClaveEmpresa");
            //DropColumn("CR.cat_Empresas", "ClaveEmpresa");
        }
    }
}
