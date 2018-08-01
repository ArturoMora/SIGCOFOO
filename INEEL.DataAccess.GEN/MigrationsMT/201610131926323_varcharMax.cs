namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class varcharMax : DbMigration
    {
        public override void Up()
        {
            AlterColumn("MT.InformeTFgeneral", "Resumen", c => c.String(nullable: false, unicode: false));
        }
        
        public override void Down()
        {
            AlterColumn("MT.InformeTFgeneral", "Resumen", c => c.String(nullable: false, storeType: "ntext"));
        }
    }
}
