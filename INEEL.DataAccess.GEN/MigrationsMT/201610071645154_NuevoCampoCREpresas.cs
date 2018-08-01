namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoCampoCREpresas : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.cat_Empresas", "EstadoEmpresa", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            //DropColumn("CR.cat_Empresas", "EstadoEmpresa");
        }
    }
}
