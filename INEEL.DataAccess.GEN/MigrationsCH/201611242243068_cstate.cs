namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cstate : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.cat_Funciones", "State", c => c.String());
        }
        
        public override void Down()
        {
            //DropColumn("GEN.cat_Funciones", "State");
        }
    }
}
