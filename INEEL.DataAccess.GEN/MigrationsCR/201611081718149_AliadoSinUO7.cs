namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AliadoSinUO7 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Convenio", "AmbitoConvId", c => c.Int());
            CreateIndex("CR.tab_Convenio", "AmbitoConvId");
            AddForeignKey("CR.tab_Convenio", "AmbitoConvId", "CR.cat_AmbitoConv", "AmbitoConvId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Convenio", "AmbitoConvId", "CR.cat_AmbitoConv");
            DropIndex("CR.tab_Convenio", new[] { "AmbitoConvId" });
            DropColumn("CR.tab_Convenio", "AmbitoConvId");
        }
    }
}
