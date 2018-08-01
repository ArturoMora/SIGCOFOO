namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migempresaint : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GI.tab_Propuesta", "EmpresaPromotorClave", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("GI.tab_Propuesta", "EmpresaPromotorClave", c => c.String());
        }
    }
}
