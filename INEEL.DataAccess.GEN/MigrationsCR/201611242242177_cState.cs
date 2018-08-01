namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cState : DbMigration
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
