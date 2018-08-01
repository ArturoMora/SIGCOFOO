namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCPEmpresaMarco : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("CR.cat_Empresas", "CP", c => c.String(maxLength: 10));
            //AlterColumn("CR.cat_Empresas", "CPR", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            //AlterColumn("CR.cat_Empresas", "CPR", c => c.String(maxLength: 5));
            //AlterColumn("CR.cat_Empresas", "CP", c => c.String(maxLength: 5));
        }
    }
}
