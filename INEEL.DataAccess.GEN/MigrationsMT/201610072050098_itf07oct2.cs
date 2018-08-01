namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itf07oct2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "Titutlo", c => c.String(maxLength: 300));
            DropColumn("MT.InformeTecnicoFinal", "numeroInforme");
        }
        
        public override void Down()
        {
            AddColumn("MT.InformeTecnicoFinal", "numeroInforme", c => c.String(maxLength: 50));
            DropColumn("MT.InformeTecnicoFinal", "Titutlo");
        }
    }
}
